// export <src> <dst.jpg> <maxPixel> <quality>
// Oriented, resized JPEG with no metadata: no EXIF, GPS, dates or maker notes.
// Only the colour profile travels with the pixels.
import Foundation
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, nil)!
let opts: [CFString: Any] = [kCGImageSourceCreateThumbnailFromImageAlways: true,
                             kCGImageSourceCreateThumbnailWithTransform: true,
                             kCGImageSourceThumbnailMaxPixelSize: Int(a[3])!]
let img = CGImageSourceCreateThumbnailAtIndex(src, 0, opts as CFDictionary)!
let dst = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[2]) as CFURL, UTType.jpeg.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dst, img, [kCGImageDestinationLossyCompressionQuality: Double(a[4])!] as CFDictionary)
guard CGImageDestinationFinalize(dst) else { exit(1) }
print("\(img.width)x\(img.height)")
