// phototool <thumbDir> <image>...
// For each image prints one JSON line: GPS, capture time, camera, size,
// people detection, aesthetics; and writes an 800px JPEG preview to thumbDir.
import Foundation
import ImageIO
import Vision
import UniformTypeIdentifiers

let args = CommandLine.arguments
let thumbDir = URL(fileURLWithPath: args[1])

func gps(_ p: [String: Any]) -> (Double, Double)? {
  guard let g = p[kCGImagePropertyGPSDictionary as String] as? [String: Any],
        var lat = g[kCGImagePropertyGPSLatitude as String] as? Double,
        var lon = g[kCGImagePropertyGPSLongitude as String] as? Double else { return nil }
  if (g[kCGImagePropertyGPSLatitudeRef as String] as? String) == "S" { lat = -lat }
  if (g[kCGImagePropertyGPSLongitudeRef as String] as? String) == "W" { lon = -lon }
  return (lat, lon)
}

for path in args.dropFirst(2) {
  autoreleasepool {
    let url = URL(fileURLWithPath: path)
    var out: [String: Any] = ["file": url.lastPathComponent]
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil) else {
      out["error"] = "unreadable"; emit(out); return
    }
    let p = (CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [String: Any]) ?? [:]
    if let (lat, lon) = gps(p) { out["lat"] = lat; out["lon"] = lon }
    let exif = p[kCGImagePropertyExifDictionary as String] as? [String: Any] ?? [:]
    let tiff = p[kCGImagePropertyTIFFDictionary as String] as? [String: Any] ?? [:]
    out["time"] = exif[kCGImagePropertyExifDateTimeOriginal as String] ?? tiff[kCGImagePropertyTIFFDateTime as String]
    out["tz"] = exif["OffsetTimeOriginal"]
    out["make"] = tiff[kCGImagePropertyTIFFMake as String]
    out["model"] = tiff[kCGImagePropertyTIFFModel as String]
    out["w"] = p[kCGImagePropertyPixelWidth as String]
    out["h"] = p[kCGImagePropertyPixelHeight as String]

    // Oriented, downscaled preview; all analysis runs on it (fast, low memory)
    let opts: [CFString: Any] = [kCGImageSourceCreateThumbnailFromImageAlways: true,
                                 kCGImageSourceCreateThumbnailWithTransform: true,
                                 kCGImageSourceThumbnailMaxPixelSize: 800]
    guard let thumb = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary) else {
      out["error"] = "nothumb"; emit(out); return
    }
    let tname = url.deletingPathExtension().lastPathComponent + ".jpg"
    if let dst = CGImageDestinationCreateWithURL(thumbDir.appendingPathComponent(tname) as CFURL,
                                                 UTType.jpeg.identifier as CFString, 1, nil) {
      CGImageDestinationAddImage(dst, thumb, [kCGImageDestinationLossyCompressionQuality: 0.8] as CFDictionary)
      CGImageDestinationFinalize(dst)
      out["thumb"] = tname
    }

    let faces = VNDetectFaceRectanglesRequest()
    let humans = VNDetectHumanRectanglesRequest()
    humans.upperBodyOnly = false
    let handler = VNImageRequestHandler(cgImage: thumb, options: [:])
    var reqs: [VNRequest] = [faces, humans]
    var aes: VNCalculateImageAestheticsScoresRequest? = nil
    if #available(macOS 15.0, *) { let a = VNCalculateImageAestheticsScoresRequest(); aes = a; reqs.append(a) }
    try? handler.perform(reqs)
    let fa = (faces.results ?? []).map { Double($0.boundingBox.width * $0.boundingBox.height) }
    let ha = (humans.results ?? []).map { Double($0.boundingBox.width * $0.boundingBox.height) }
    out["faces"] = fa.count; out["faceMax"] = fa.max() ?? 0
    out["humans"] = ha.count; out["humanMax"] = ha.max() ?? 0
    if let a = aes, let r = a.results?.first {
      out["aes"] = Double(r.overallScore); out["utility"] = r.isUtility
    }
    emit(out)
  }
}

func emit(_ o: [String: Any]) {
  if let d = try? JSONSerialization.data(withJSONObject: o.compactMapValues { $0 }), let s = String(data: d, encoding: .utf8) {
    print(s); fflush(stdout)
  }
}
