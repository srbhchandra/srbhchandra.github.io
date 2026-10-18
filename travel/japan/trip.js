/* Japan itinerary: the single source for the page.
   Each day lists items; an item is one line of the itinerary.
     kind:  walk | see | food | miss
     stops: places on the map, [name, lon, lat, tags?]; a stop without
            coordinates is listed but not pinned; stop tags as a string, e.g. 'hl history'
     tags:  hl (highlight), nature, history, tour (ticket or guided tour),
            book (book ahead); best: label for a "best of the trip"
   Day `travel` is how we got between bases: { mode, h, line: [[lon, lat], ...] }
   (stations in order; drawn as straight segments). `base` is where the night
   is spent; `country` here is the base region, for the colours.
   Coordinates come from where our photos were taken. Draft: see private/japan-review.md. */
window.TRIP = {
  meta: {
    title: 'Japan', subtitle: 'Tokyo to Hiroshima by train',
    dek: 'Twelve days by train: Tokyo, a day in Nikko, a night under Mount Fuji, Kyoto and Nara, Osaka, Hiroshima and Miyajima. Probably the best trip of our lives, mostly because of the people.',
    mosaic: [[5, 'Mount Fuji'], [10, 'Miyajima'], [6, 'Fushimi Inari'], [3, 'Nikko']],
    quote: { text: 'Life is like a long journey carrying a heavy burden. There is no need to rush.', by: 'Tokugawa Ieyasu, on a sign in the cedar forest at Nikkō Tōshō-gū', photo: 'd03-ieyasu-testament', caption: 'The opening line of the Testament of Ieyasu, Nikkō' },
    storyKicker: 'Why it was our best trip',
    storyTitle: 'It was the people',
    story: [
      'We went for the shrines and temples, Mount Fuji and the food. Japan felt like an intense mix of the future and the past: the neon glow of Akihabara one night, a centuries-old shrine in a cedar forest the next morning. But what we remember most is the people: a cab driver who went out of his way to show us Fuji, a train driver who stepped off his train to help us buy tickets, strangers who stopped whenever we looked lost. We came home grateful. Read more in <a href="#notes-the-people">The people</a>, at the end.'
    ],
    overviewTitle: 'Tokyo, Fuji, Kyoto, Osaka, Hiroshima',
    overview: 'Fly into Tokyo and out of Tokyo, and go everywhere else by train, with one highway bus to Mount Fuji. Cities are best on foot; the days swing between neon cities, old shrines and temples, and two of the most beautiful nature days of the trip: Mount Fuji at sunrise and the view from Mount Misen. It’s an ideal first trip to Japan: the classic sights, in a sensible order. If you’ve been before, skip the most crowded famous spots (Kyoto’s especially) and look for quiet places like the ones we stumbled on.'
  },
  countries: {
    TK: { name: 'Tokyo', color: '#2a78d6' },
    FJ: { name: 'Mount Fuji', color: '#eb6834' },
    KY: { name: 'Kyoto', color: '#1baf7a' },
    OS: { name: 'Osaka', color: '#eda100' },
    HI: { name: 'Hiroshima', color: '#e87ba4' }
  },
  days: [
    {
      n: 1, title: 'Tokyo: Asakusa, Harajuku, Shibuya, Shinjuku', place: 'Tokyo', base: 'Tokyo (Akihabara)', country: 'TK',
      items: [
        { kind: 'see', text: 'Arriving late: Kanda Myōjin shrine, lit up at night near Akihabara', stops: [['Kanda Myōjin', 139.7679, 35.7019]] },
        { kind: 'walk', label: 'Asakusa', tags: ['hl', 'history'], stops: [
          ['Kaminarimon (Thunder Gate)', 139.7964, 35.7111], ['Nakamise-dōri and the shopping streets around it', 139.7966, 35.7125],
          ['Sensō-ji, Tokyo’s oldest temple', 139.7967, 35.7144, 'hl'] ],
          aside: 'Sensō-ji is dedicated to Kannon, the Bodhisattva of compassion: Avalokiteśvara, who came from India to Japan with Buddhism. We also found matcha beer somewhere in these streets.' },
        { kind: 'walk', label: 'Omotesandō and Harajuku', stops: [
          ['Omotesandō', 139.7059, 35.6686], ['Harajuku Station', 139.7024, 35.6707],
          ['Meiji Jingu shrine', 139.7006, 35.6746, 'hl'], ['Meiji Jingu inner garden', 139.7005, 35.6724],
          ['Takeshita Street', 139.7036, 35.6716] ],
          aside: 'Ultra-modern buildings with open façades and gardens on top, and Harajuku street fashion (lots of gothic looks). Very crowded, which we didn’t enjoy, but we were part of it: a glimpse of an ultra-commercial world, a few minutes from the calm of Meiji Jingu’s forest.' },
        { kind: 'walk', label: 'Evening in Shibuya', stops: [
          ['Omotesandō at night', 139.7057, 35.6689], ['Shibuya Crossing', 139.7006, 35.6595, 'hl'],
          ['Shibuya Center Gai', 139.6985, 35.6605] ] },
        { kind: 'walk', label: 'Night in Shinjuku', stops: [
          ['Kabukichō', 139.7012, 35.6932], ['Golden Gai bars', 139.7045, 35.6941] ] }
      ]
    },
    {
      n: 2, title: 'Tokyo: Imperial Palace, Tsukiji, Ginza, Roppongi', place: 'Tokyo', base: 'Tokyo (Akihabara)', country: 'TK',
      items: [
        { kind: 'walk', label: 'Imperial Palace', tags: ['history'], stops: [
          ['Nippon Budōkan and Kitanomaru Park', 139.7494, 35.6936], ['Kitahanebashi Gate and the moat', 139.7540, 35.6891],
          ['Imperial Palace East Gardens', 139.7598, 35.6859] ] },
        { kind: 'walk', label: 'Tsukiji', stops: [
          ['Tsukiji Hongan-ji', 139.7724, 35.6665], ['Tsukiji Outer Market', 139.7707, 35.6656, 'hl'] ] },
        { kind: 'food', tags: ['hl'], text: 'Seafood bowl and street skewers at Tsukiji Outer Market', stops: [['Tsukiji Outer Market stalls', 139.7707, 35.6658]] },
        { kind: 'walk', stops: [
          ['Yūrakuchō’s alleys under the railway', 139.7617, 35.6725], ['Ginza', 139.7644, 35.6708] ] },
        { kind: 'walk', text: 'Chūō-dōri in Akihabara, closed to cars on Sundays', stops: [['Chūō-dōri, Akihabara', 139.7717, 35.7020]] },
        { kind: 'see', tags: ['hl'], text: 'Tokyo City View at Roppongi Hills: the city and Tokyo Tower at night', stops: [['Roppongi Hills, Tokyo City View', 139.7292, 35.6605]] },
        { kind: 'food', text: 'Dinner in Roppongi', stops: [['Roppongi', 139.7328, 35.6615]] }
      ]
    },
    {
      n: 3, title: 'Day trip to Nikko', place: 'Nikko', base: 'Tokyo (Akihabara)', country: 'TK',
      travel: { mode: 'Tobu train from Asakusa, and back', h: 2, line: [[139.7980, 35.7110], [139.6197, 36.7476], [139.5991, 36.7550]] },
      items: [
        { kind: 'see', tags: ['hl', 'history'], text: 'Nikkō Tōshō-gū, the lavish shrine of the first Tokugawa shogun', stops: [['Nikkō Tōshō-gū', 139.5989, 36.7576]],
          aside: 'Nikko’s two shrines (Tōshō-gū and Futarasan) and one temple (Rinnō-ji) are a UNESCO World Heritage site together.' },
        { kind: 'see', tags: ['nature', 'history'], text: 'Rinnō-ji’s Hall of Three Buddhas, and its garden in autumn colours', stops: [['Rinnō-ji Sanbutsu-dō', 139.6005, 36.7552]],
          aside: 'Three giant gilded statues stand side by side. It felt like a Hindu trinity; they are Buddhist forms of the gods of Nikko’s three sacred mountains.' },
        { kind: 'walk', tags: ['nature'], stops: [['Forest path down to the river', 139.6037, 36.7539], ['Shinkyō Bridge', 139.6044, 36.7538, 'hl']] },
        { kind: 'walk', tags: ['hl', 'nature'], text: 'Kanmangafuchi Abyss: a riverside walk past rows of stone Jizō statues', stops: [['Daiya River', 139.5933, 36.7504], ['Kanmangafuchi Abyss', 139.5886, 36.7489]],
          aside: 'Across the river, Sanskrit letters are carved into the rock: “kanman”, the last word of the mantra of Fudō Myōō (Acala in Sanskrit), which gives the abyss its name.' }
      ]
    },
    {
      n: 4, title: 'Tokyo to Mount Fuji', place: 'Tokyo → Mount Fuji', base: 'Fujikawaguchiko', country: 'FJ',
      travel: { mode: 'Highway bus from Shinjuku', h: 2, line: [[139.7006, 35.6884], [138.7645, 35.4984]] },
      items: [
        { kind: 'walk', text: 'Nishi-Shinjuku’s skyscrapers and the Tokyo Metropolitan Government Building (the queue for its free observation deck was too long)', stops: [['Tokyo Metropolitan Government Building', 139.6924, 35.6889]] },
        { kind: 'see', tags: ['hl', 'history'], text: 'Saiko Iyashi-no-Sato Nenba: a farming village of thatched houses with roofs shaped like a samurai helmet, destroyed by a typhoon landslide in 1966 and rebuilt as an open-air museum, facing Mount Fuji. We got here by cab, and the driver made the day (see “It was the people”)', stops: [['Lake Saiko', 138.6646, 35.5007], ['Iyashi-no-Sato Nenba', 138.6619, 35.5048]] },
        { kind: 'see', tags: ['hl', 'nature'], text: 'Kōyōdai: up an unpaved road to a viewpoint run by an old couple. The best view of Fuji, and no one else there', stops: [['Kōyōdai', 138.6792, 35.4840]] },
        { kind: 'see', tags: ['hl', 'nature'], text: 'Oishi Park on Lake Kawaguchi: red kochia bushes with Fuji behind', stops: [['Lake Kawaguchi', 138.7339, 35.5127], ['Oishi Park', 138.7451, 35.5220]] },
        { kind: 'miss', text: 'Oshino Hakkai, the spring-fed ponds with Fuji views', stops: [['Oshino Hakkai', 138.8338, 35.4606]] }
      ]
    },
    {
      n: 5, title: 'Fuji sunrise, then Kyoto', place: 'Mount Fuji → Kyoto', base: 'Kyoto', country: 'KY',
      travel: { mode: 'Bus to Mishima, then the Shinkansen', h: 4, line: [[138.7645, 35.4984], [138.8492, 35.4258], [138.9112, 35.1272], [135.7584, 34.9863]] },
      items: [
        { kind: 'see', tags: ['hl', 'nature'], best: 'Best nature', text: 'Sunrise over Mount Fuji from where we stayed, near Lake Kawaguchi' },
        { kind: 'see', tags: ['nature'], text: 'Mount Fuji from the Shinkansen, sitting on the right side', stops: [['Near Shin-Fuji', 138.7448, 35.1554]] },
        { kind: 'walk', label: 'Higashiyama, Kyoto', tags: ['hl'], stops: [
          ['Kiyomizu-dera', 135.7846, 34.9948, 'hl'], ['Sannenzaka and Ninenzaka', 135.7810, 34.9962],
          ['Yasaka Pagoda', 135.7798, 34.9986], ['Nene-no-michi', 135.7800, 35.0009],
          ['Yasaka Shrine, lit up at dusk', 135.7783, 35.0035, 'hl'], ['Gion', 135.7740, 35.0016] ],
          aside: 'Kiyomizu-dera, like Sensō-ji, is a temple of Kannon (Avalokiteśvara).' },
        { kind: 'walk', label: 'Evening in Kyoto', stops: [
          ['Kamo River', 135.7711, 35.0027], ['Pontochō alley', 135.7711, 35.0050, 'hl'], ['Sanjō Bridge', 135.7717, 35.0087] ] },
        { kind: 'see', text: 'Heian Shrine’s giant red torii at night', stops: [['Heian Shrine torii', 135.7819, 35.0109]] }
      ]
    },
    {
      n: 6, title: 'Kyoto: Nijō Castle, Nishiki Market, Fushimi Inari', place: 'Kyoto', base: 'Kyoto', country: 'KY',
      items: [
        { kind: 'see', tags: ['hl', 'history'], text: 'Nijō Castle: the Ninomaru Palace, its gardens, and the view from the keep walls', stops: [['Nijō Castle', 135.7483, 35.0138]] },
        { kind: 'food', text: 'Matcha and sweets at a tea house inside Nijō Castle', stops: [['Nijō Castle tea house', 135.7482, 35.0151]] },
        { kind: 'food', tags: ['hl'], text: 'Lunch by grazing Nishiki Market: tamagoyaki, sea urchin, seafood skewers', stops: [['Nishiki Market', 135.7633, 35.0049]] },
        { kind: 'walk', text: 'Teramachi and Shinkyōgoku covered shopping streets', stops: [['Teramachi', 135.7665, 35.0052]] },
        { kind: 'see', tags: ['hl'], text: 'Fushimi Inari Taisha at dusk: tunnels of red torii', stops: [['Fushimi Inari Taisha', 135.7738, 34.9671]] },
        { kind: 'food', tags: ['hl'], text: 'Dinner at Gyukatsu Kyoto Katsugyu, near Fushimi Inari: crisp beef cutlet. Absolutely amazing', stops: [['Gyukatsu Kyoto Katsugyu', 135.7690, 34.9683]] },
        { kind: 'miss', text: 'Kinkaku-ji, the Golden Pavilion', stops: [['Kinkaku-ji', 135.7292, 35.0394]] },
        { kind: 'miss', text: 'Arashiyama’s bamboo forest and Tenryū-ji: we skipped them because the bamboo forest is famously crowded. Quieter bamboo: Adashino Nenbutsu-ji nearby, or the small grove at Kōdai-ji in Higashiyama', stops: [['Arashiyama bamboo forest', 135.6717, 35.0170], ['Tenryū-ji', 135.6737, 35.0157], ['Adashino Nenbutsu-ji', 135.6672, 35.0270]] },
        { kind: 'miss', text: 'Sanjūsangen-dō, with its 1,001 statues of Kannon', stops: [['Sanjūsangen-dō', 135.7718, 34.9879]] },
        { kind: 'miss', text: 'A geisha dance performance in Gion', stops: [['Gion', 135.7756, 35.0013]] }
      ]
    },
    {
      n: 7, title: 'Nara, then Osaka', place: 'Kyoto → Nara → Osaka', base: 'Osaka', country: 'OS',
      travel: { mode: 'Train to Nara, then on to Osaka', h: 2, line: [[135.7584, 34.9860], [135.8279, 34.6842], [135.5063, 34.6771]] },
      items: [
        { kind: 'see', text: 'Kyoto Station’s giant atrium and Skyway', stops: [['Kyoto Station', 135.7584, 34.9860]] },
        { kind: 'walk', label: 'Nara Park', tags: ['hl', 'history'], stops: [
          ['Nara Park and its deer', 135.8366, 34.6828, 'hl'], ['Kasuga-taisha', 135.8394, 34.6819],
          ['Tōdai-ji Nandaimon gate', 135.8400, 34.6857], ['Tōdai-ji Great Buddha Hall', 135.8398, 34.6889, 'hl'],
          ['Isuien Garden and the Neiraku Museum', 135.8370, 34.6853] ],
          aside: 'Nara was Japan’s capital from 710 to 784, before Kyoto. Tōdai-ji’s Great Buddha Hall is guarded by Kōmokuten and Tamonten, two of the Four Heavenly Kings who came from India with Buddhism (Tamonten is Vaiśravaṇa, the Kubera of Hindu tradition). The fierce Niō in the great gate are forms of Vajrapāṇi.' },
        { kind: 'walk', text: 'Dōtonbori, Osaka, at night along the canal: famous, but a disappointment (see the honest notes)', stops: [['Dōtonbori', 135.5024, 34.6690]] }
      ]
    },
    {
      n: 8, title: 'Osaka in the rain', place: 'Osaka', base: 'Osaka', country: 'OS',
      items: [
        { kind: 'see', tags: ['hl', 'history'], text: 'Osaka Castle: the moats, the park, and the view from the top floor', stops: [['Ōtemon Gate', 135.5227, 34.6852], ['Osaka Castle', 135.5259, 34.6866]] },
        { kind: 'food', tags: ['hl'], best: 'Best bite', text: 'Black beef sushi from a shop inside the castle grounds, where the rain drove us. Then ice cream', stops: [['Osaka Castle food shops', 135.5263, 34.6862]] },
        { kind: 'walk', stops: [
          ['Shinsaibashi-suji arcade', 135.5014, 34.6749], ['Dōtonbori and the Glico sign', 135.5014, 34.6689], ['Namba', 135.5035, 34.6671] ] },
        { kind: 'miss', text: 'Umeda Sky Building', stops: [['Umeda Sky Building', 135.4904, 34.7053]] },
        { kind: 'miss', text: 'Kuromon Market', stops: [['Kuromon Market', 135.5065, 34.6656]] },
        { kind: 'miss', text: 'Shinsekai and Tsūtenkaku tower (our friends went)', stops: [['Shinsekai', 135.5058, 34.6511]] }
      ]
    },
    {
      n: 9, title: 'Osaka to Hiroshima', place: 'Osaka → Hiroshima', base: 'Hiroshima', country: 'HI',
      travel: { mode: 'Shinkansen', h: 1.5, line: [[135.4991, 34.7327], [132.4750, 34.3972]] },
      items: [
        { kind: 'see', tags: ['hl', 'history', 'tour'], text: 'Hiroshima Peace Memorial Museum', stops: [['Peace Memorial Museum', 132.4527, 34.3918]] },
        { kind: 'walk', tags: ['history'], stops: [
          ['Peace Memorial Park and the Cenotaph', 132.4529, 34.3929], ['Atomic Bomb Dome', 132.4534, 34.3955, 'hl'] ] },
        { kind: 'walk', text: 'Hondōri shopping arcade', stops: [['Hondōri', 132.4569, 34.3937]] }
      ]
    },
    {
      n: 10, title: 'Miyajima', place: 'Miyajima', base: 'Hiroshima', country: 'HI',
      travel: { mode: 'High-speed boat from Peace Park to Miyajima, and back', h: 0.75, line: [[132.4510, 34.3926], [132.3226, 34.3034]] },
      items: [
        { kind: 'walk', text: 'Peace Memorial Park in the morning', stops: [['Peace Memorial Park', 132.4519, 34.3925]] },
        { kind: 'food', tags: ['hl'], text: 'Grilled oysters on Miyajima', stops: [['Miyajima', 132.3217, 34.3004]] },
        { kind: 'see', tags: ['hl', 'history'], best: 'Best sight', text: 'Itsukushima Shrine and its torii standing in the sea', stops: [['Itsukushima Shrine', 132.3197, 34.2970]],
          aside: 'For centuries the shrine’s goddess was identified with Benzaiten, who is Saraswati of Hindu tradition. When Shinto and Buddhism were separated in 1868, Benzaiten moved next door to Daigan-ji, one of Japan’s three great Benzaiten temples.' },
        { kind: 'walk', tags: ['nature'], text: 'Momijidani Park', stops: [['Momijidani Park', 132.3256, 34.2937]] },
        { kind: 'see', tags: ['hl', 'nature'], text: 'Ropeway up Mount Misen, then a short hike to the views over the Inland Sea', stops: [['Miyajima Ropeway', 132.3277, 34.2812], ['Mount Misen', 132.3253, 34.2791]] },
        { kind: 'see', text: 'The torii again at sunset, then a dash for the last boat back: we only just made it after hiking down', stops: [['Miyajima pier', 132.3226, 34.3034]] },
        { kind: 'food', tags: ['hl'], best: 'Best food', text: 'Teppanyaki dinner in Hiroshima: wagyu, seafood and vegetables on the grill', stops: [['Hiroshima', 132.4549, 34.3941]] },
        { kind: 'see', text: 'The Flame of Peace at night', stops: [['Flame of Peace', 132.4522, 34.3921]] }
      ]
    },
    {
      n: 11, title: 'Hiroshima back to Tokyo', place: 'Hiroshima → Tokyo', base: 'Tokyo (Hamamatsuchō)', country: 'TK',
      travel: { mode: 'Shinkansen, in the Green Car (first class)', h: 4, line: [[132.4750, 34.3972], [139.7407, 35.6284]] },
      items: [
        { kind: 'food', text: 'Fruit sandos from Be! Fruits Sandwich, a shop at Tokyo Station that sells nothing else', stops: [['Be! Fruits Sandwich, Tokyo Station', 139.7671, 35.6816]] },
        { kind: 'walk', label: 'Tokyo at night', stops: [['Yaesu', 139.7711, 35.6815], ['Kyōbashi', 139.7700, 35.6772], ['Ginza at night', 139.7633, 35.6727, 'hl']] },
        { kind: 'see', tags: ['hl'], text: 'Tokyo Tower lit up, and Zōjō-ji below it, near midnight', stops: [['Tokyo Tower', 139.7469, 35.6584], ['Zōjō-ji', 139.7502, 35.6575]] }
      ]
    },
    {
      n: 12, title: 'Tokyo: Ueno, then home', place: 'Tokyo → home', base: null, country: 'TK',
      travel: { mode: 'Train to Narita airport', h: 1, line: [[139.7557, 35.6567], [140.3839, 35.7637]] },
      items: [
        { kind: 'walk', text: 'Ueno Park', stops: [['Ueno Park', 139.7753, 35.7152]] },
        { kind: 'see', tags: ['hl', 'history'], text: 'Tokyo National Museum: samurai swords, Buddhist statues, lacquer and ceramics', stops: [['Tokyo National Museum', 139.7769, 35.7188]],
          aside: 'Here we found Taishakuten, a 10th-century guardian whose label says he may be based on Indra (or Brahma): one of many Hindu gods taken into Buddhism as its protectors.' },
        { kind: 'food', text: 'A bottle of plain milk at the milk stand in Akihabara Station. Simple, and so good', stops: [['Milk stand, Akihabara Station', 139.7751, 35.6985]] },
        { kind: 'food', text: 'Katsu curry in Akihabara', stops: [['Akihabara', 139.7757, 35.6985]] },
        { kind: 'walk', text: 'Shiba Daimon gate and Hamamatsuchō', stops: [['Shiba Daimon', 139.7557, 35.6567]] }
      ]
    }
  ],
  takeaways: [
    'The people make Japan.',
    'Nothing gets lost in Japan, so travel light: send your suitcases ahead and carry a backpack.',
    'You don’t need a car. Trains, a highway bus and the odd cab took us everywhere, and we never regretted it.',
    'Ride the Shinkansen at least once; for a long ride, the Green Car is worth it.',
    'Go early, or go where the tripods aren’t. The quiet places felt like heaven.',
    'Leave room for the unplanned: a drinks fair, a food festival, sushi in a castle. They were the best moments.',
    'Covered shopping streets and markets run for blocks, some underground. A rainy day can be spent entirely under them.',
    'Shops and services fill every floor of a building, not just the street level. Look up.'
  ],
  notes: [
    { title: 'A short history refresher', items: [
      { head: 'Two religions, intertwined: Shinto and Buddhism.',
        body: 'Shinto is Japan’s own faith, of kami (gods and spirits) in nature, ancestors and places. Buddhism arrived in the 6th century, from India by way of China and Korea. For over a thousand years the two blended: kami were seen as local forms of Buddhas, and shrines and temples often shared grounds. The government formally separated them in 1868, but you still see them side by side, as in Nikko.' },
      { head: 'Shrines are Shinto, temples are Buddhist.',
        body: 'A shrine has a torii gate: bow twice, clap twice, pray, bow once more. A temple has a sanmon gate: bow and pray with your hands together, no clapping.' },
      { head: 'Hindu gods came to Japan with Buddhism.',
        body: 'This surprised me most. Buddhism brought many Indian gods with it, renamed and recast as protectors of the Buddha: Bonten is Brahma, Taishakuten is Indra (the two often stand either side of a Buddha; Tōdai-ji has 8th-century statues of the pair), Benzaiten is Saraswati, Daikokuten comes from Mahākāla, a fierce form of Shiva, and Bishamonten or Tamonten is Vaiśravaṇa, the Kubera of Hindu tradition. Kannon, the Bodhisattva of compassion at Sensō-ji and Kiyomizu-dera, is Avalokiteśvara. There is no Brahma, Vishnu and Shiva trinity as such; the triad I saw at Nikko is Buddhist. Nara is where this first caught my attention, and it made me want to learn more.',
        photos: [['d12-taishakuten', 'Taishakuten, 10th century, perhaps based on Indra. Tokyo National Museum']] },
      { head: 'Nara, then Kyoto, then Tokyo.',
        body: 'Nara was Japan’s first permanent capital, from 710 to 784. After ten years at Nagaoka, the capital moved to Kyoto in 794 and stayed for over a thousand years. Real power often sat elsewhere, with the shoguns in Kamakura and then Edo, today’s Tokyo, which became the capital in 1868. Nikko was never a capital: it is where Tokugawa Ieyasu, founder of the Edo shogunate, is enshrined.' }
    ] },
    { title: 'The people', items: [
      { head: 'Our cab driver at Mount Fuji made the trip.',
        body: 'Fuji was hidden when we arrived, so we took a cab to Iyashi-no-Sato Nenba, a little sceptical and talking only through a translation app. He worked out that we hadn’t seen Fuji yet, watched for it, and stopped as soon as it appeared. At Nenba he offered to wait, and waited an hour or two without asking for anything. On the way back he asked if we’d like to see a local favourite: he drove up an unpaved road, hard on his car (we briefly wondered if this was a kidnapping), to Kōyōdai, a viewpoint run by an old couple. Best view of Fuji of the trip, and no one else there. Then he took us to Oishi Park.' },
      { head: 'Tipping is frowned on, so we asked first.',
        body: 'We wanted to thank him properly. We put the money in an envelope and asked, politely, whether he’d mind if we gave him more than the agreed fare. He hesitated, then accepted.' },
      { head: 'A train driver got off his train to help us buy tickets.',
        body: 'We thought our pass was enough; it wasn’t, and the train was minutes from leaving. The driver stepped down, walked us to the ticket machine, watched us fumble, took over, worked out the fare, waited calmly while we fumbled with the cash, and then got back into his cab.' },
      { head: 'In Hiroshima, strangers kept stopping to help.',
        body: 'Every time we stood looking lost at a map for a few minutes, someone stopped to guide us. It happened again and again, in the city that has suffered more than any other.' },
      { head: 'Pride in the work, even in small things.',
        body: 'An old cab driver looked almost hurt when I loaded my own suitcase into his car, and wouldn’t let me hold his bag to make his seat more comfortable. On the Shinkansen, the ticket inspector bowed and treated every passenger with the same quiet respect.' },
      { head: 'We didn’t speak Japanese, and it hardly mattered.',
        body: 'We should have prepared better, and communication was a struggle. Yet everywhere we went, people found a way to help. We came home grateful to the people we met, and for being lucky enough to see Japan this way.' },
      { head: 'We felt completely safe, at any hour.',
        body: 'We walked around late at night without a worry. Bright streets and shops open late made the cities feel alive rather than empty.' }
    ] },
    { title: 'Getting around without a car', items: [
      { head: 'Public transport everywhere, and no regrets.',
        body: 'Unlike our Central Europe trip, we didn’t rent a car. Trains took us everywhere, plus one highway bus to Mount Fuji, a boat to Miyajima, and the odd cab.' },
      { head: 'Take the Shinkansen, and treat yourself to the Green Car.',
        body: 'We took three bullet trains: from near Mount Fuji to Kyoto, Osaka to Hiroshima, and Hiroshima back to Tokyo. Smooth, comfortable and fast; we loved every ride. For the long one back to Tokyo we upgraded to the Green Car (first class), and the service was excellent. Pick up a bento at the station before you board.' },
      { head: 'Send your luggage ahead, and skip a stop.',
        body: 'Most hotels will forward your suitcase to your next hotel for a small fee, with handwritten forms and no computer system in sight. It always arrived on time. Our trick: send it two stops ahead (Tokyo straight to Kyoto, say) and carry a backpack for the night in between. When ours hadn’t reached Kyoto yet, the hotel staff said, “Nothing gets lost in Japan.” They were right.' },
      { head: 'Get a Suica or Pasmo card.',
        body: 'One card works on most city trains and metros, and in convenience stores. The Shinkansen (bullet train) is ticketed separately. Check whether your pass covers each train before you board.' },
      { head: 'Your phone does the rest.',
        body: 'An eSIM before you land, Google Maps for train routes and platforms, and a camera translation app (Google Translate, Papago) for menus and signs.' }
    ] },
    { title: 'Eating', items: [
      { head: 'The best meal: teppanyaki in Hiroshima.',
        body: 'Wagyu, seafood and vegetables cooked on the grill in front of us.' },
      { head: 'The best bite: black beef sushi inside Osaka Castle.',
        body: 'It was raining, so we ducked into the shops in the castle grounds. Who expects great food there? It was the best single bite of the trip.' },
      { head: 'Some of the best food was unplanned.',
        body: 'A Japanese drinks fair we stumbled into in Akihabara (buy coupons, taste everything), a food festival in Nara Park, grilled oysters on Miyajima, a fried-dumpling place with endless dumplings and cold Japanese beer, matcha beer in Tokyo, and a bottle of plain milk at the milk stand in Akihabara Station that we still talk about.' },
      { head: 'Go to a convenience store every day.',
        body: 'We did, for random desserts, fried chicken that was always juicy, and fruit sandos: soft white bread with cream and fresh fruit, the best of all, and often sold out. One day we went to Be! Fruits Sandwich at Tokyo Station, which sells nothing but fruit sandos. 7-Eleven for onigiri and sandwiches, FamilyMart for fried chicken, Lawson for desserts. With a store open on almost every corner, we never worried about food or drinks.' },
      { head: 'Look out for the fresh orange juice machines.',
        body: 'Cheap machines that squeeze oranges on the spot, in several places. After a long day walking in the heat and humidity, they were a lifesaver.' },
      { head: 'Meals there are long and slow.',
        body: 'At izakaya-style places we would order a few dishes, eat, drink, order more, and keep going for three or four hours. It’s a different rhythm from the one-main-course dinners we’re used to elsewhere, and we loved it.' },
      { head: 'The beer tasted different, and we can’t explain why.',
        body: 'Nothing fancy, just the everyday Asahi and the rest. They all say “dry” on the label, but they didn’t taste dry, and the same labels at home don’t taste the same. Our best guess is freshness: in Japan it’s brewed nearby and served fresh and very cold, often on draft, while abroad it has travelled for weeks or is brewed under licence elsewhere. We could have drunk a lot of it.' },
      { head: 'Markets, and miles of covered streets.',
        body: 'Tsukiji, Nishiki, and the long covered shopping streets were highlights in themselves: you can walk for blocks under cover, or underground. Try Hiroshima-style okonomiyaki in Hiroshima.' }
    ] },
    { title: 'Temples, shrines and crowds', items: [
      { head: 'Kyoto was crowded, but it is truly the cultural capital.',
        body: 'The famous spots were packed with people chasing the perfect photo, which took some of the joy out of them. Even so, nowhere else felt so full of history and culture. Go early, or pick the quieter temples.' },
      { head: 'Go early, and look for the quiet places.',
        body: 'The famous spots are crowded, and full of photographers with tripods. Early mornings, and places like Kōyōdai where we were alone, felt like the real Japan.' },
      { head: 'The days are short in early autumn.',
        body: 'It gets dark around 5 pm, and most sights close about then. Plan the important ones for the morning.' },
      { head: 'Bring comfortable shoes.',
        body: 'We walked so much that our feet hurt.' }
    ] },
    { title: 'Honest notes', items: [
      { head: 'Dōtonbori was a disappointment.',
        body: 'The food was so-so, and it was the least clean place we saw in Japan; we even saw rats near the restaurants.' },
      { head: 'Akihabara after midnight shows another side.',
        body: 'Our first night, we walked out after midnight and found women in anime costumes handing out flyers for “girlfriend” bars, where men pay for company and conversation. Harmless, but it felt strange next to everything else we saw.' }
    ] }
  ]
};
