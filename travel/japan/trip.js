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
    dek: 'Twelve days by train: Tokyo, a day in Nikko, a night under Mount Fuji, Kyoto and Nara, Osaka, Hiroshima and Miyajima, and back to Tokyo.',
    overviewTitle: 'Tokyo, Fuji, Kyoto, Osaka, Hiroshima',
    overview: 'Fly into Tokyo and out of Tokyo, and go everywhere else by train, with one highway bus to Mount Fuji. Cities are best on foot; the days alternate between long city walks, temples and shrines, and two of the most beautiful nature days of the trip: Mount Fuji at sunrise and the view from Mount Misen.'
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
          ['Kaminarimon (Thunder Gate)', 139.7964, 35.7111], ['Nakamise-dōri', 139.7966, 35.7125],
          ['Sensō-ji, Tokyo’s oldest temple', 139.7967, 35.7144, 'hl'] ] },
        { kind: 'walk', label: 'Harajuku', stops: [
          ['Tokyu Plaza’s mirrored entrance', 139.7059, 35.6686], ['Harajuku Station', 139.7024, 35.6707],
          ['Meiji Jingu shrine', 139.7006, 35.6746, 'hl'], ['Meiji Jingu inner garden', 139.7005, 35.6724] ] },
        { kind: 'food', text: 'Street snack in Harajuku', stops: [['Harajuku', 139.7033, 35.6696]] },
        { kind: 'walk', label: 'Evening in Shibuya', stops: [
          ['Omotesandō', 139.7057, 35.6689], ['Shibuya Crossing', 139.7006, 35.6595, 'hl'],
          ['Shibuya Center Gai', 139.6985, 35.6605] ] },
        { kind: 'walk', label: 'Night in Shinjuku', stops: [
          ['Kabukichō', 139.7012, 35.6932], ['Golden Gai bars', 139.7045, 35.6941] ] },
        { kind: 'food', text: 'Conveyor-belt sushi in Shibuya', stops: [['Shibuya', 139.6984, 35.6605]] }
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
        { kind: 'food', tags: ['hl'], text: 'Seafood bowl and street skewers at Tsukiji Outer Market', stops: [['Tsukiji Outer Market', 139.7707, 35.6658]] },
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
        { kind: 'see', tags: ['hl', 'history'], text: 'Nikkō Tōshō-gū, the lavish shrine of the first Tokugawa shogun', stops: [['Nikkō Tōshō-gū', 139.5989, 36.7576]] },
        { kind: 'see', tags: ['nature'], text: 'Rinnō-ji’s Hall of Three Buddhas, and its garden in autumn colours', stops: [['Rinnō-ji Sanbutsu-dō', 139.6005, 36.7552]] },
        { kind: 'walk', tags: ['nature'], stops: [['Forest path down to the river', 139.6037, 36.7539], ['Shinkyō Bridge', 139.6044, 36.7538, 'hl']] },
        { kind: 'walk', tags: ['hl', 'nature'], text: 'Kanmangafuchi Abyss: a riverside walk past rows of stone Jizō statues', stops: [['Daiya River', 139.5933, 36.7504], ['Kanmangafuchi Abyss', 139.5886, 36.7489]] }
      ]
    },
    {
      n: 4, title: 'Tokyo to Mount Fuji', place: 'Tokyo → Mount Fuji', base: 'Fujikawaguchiko', country: 'FJ',
      travel: { mode: 'Highway bus from Shinjuku', h: 2, line: [[139.7006, 35.6884], [138.7645, 35.4984]] },
      items: [
        { kind: 'walk', text: 'Nishi-Shinjuku’s skyscrapers and the Tokyo Metropolitan Government Building', stops: [['Tokyo Metropolitan Government Building', 139.6924, 35.6889]] },
        { kind: 'see', tags: ['hl', 'history'], text: 'Saiko Iyashi-no-Sato Nenba, a village of thatched houses facing Mount Fuji', stops: [['Lake Saiko', 138.6646, 35.5007], ['Iyashi-no-Sato Nenba', 138.6619, 35.5048]] },
        { kind: 'see', tags: ['nature'], text: 'Kōyōdai viewpoint: Mount Fuji above the clouds', stops: [['Kōyōdai', 138.6792, 35.4840]] },
        { kind: 'see', tags: ['hl', 'nature'], text: 'Oishi Park on Lake Kawaguchi: red kochia bushes with Fuji behind', stops: [['Lake Kawaguchi', 138.7339, 35.5127], ['Oishi Park', 138.7451, 35.5220]] }
      ]
    },
    {
      n: 5, title: 'Fuji sunrise, then Kyoto', place: 'Mount Fuji → Kyoto', base: 'Kyoto', country: 'KY',
      travel: { mode: 'Bus to Mishima, then the Shinkansen', h: 4, line: [[138.7645, 35.4984], [138.8492, 35.4258], [138.9112, 35.1272], [135.7584, 34.9863]] },
      items: [
        { kind: 'see', tags: ['hl', 'nature'], best: 'Best nature', text: 'Sunrise over Mount Fuji from where we stayed', stops: [['Fujikawaguchiko', 138.7654, 35.5297]] },
        { kind: 'see', tags: ['nature'], text: 'Mount Fuji from the Shinkansen, sitting on the right side', stops: [['Near Shin-Fuji', 138.7448, 35.1554]] },
        { kind: 'walk', label: 'Higashiyama', tags: ['hl'], stops: [
          ['Kiyomizu-dera', 135.7846, 34.9948, 'hl'], ['Sannenzaka and Ninenzaka', 135.7810, 34.9962],
          ['Yasaka Pagoda', 135.7798, 34.9986], ['Nene-no-michi', 135.7800, 35.0009],
          ['Yasaka Shrine, lit up at dusk', 135.7783, 35.0035, 'hl'], ['Gion', 135.7740, 35.0016] ] },
        { kind: 'walk', label: 'Evening', stops: [
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
        { kind: 'food', text: 'Tonkatsu dinner near Inari station', stops: [['Inari', 135.7690, 34.9683]] }
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
          ['A Japanese garden next to Tōdai-ji', 135.8370, 34.6853] ] },
        { kind: 'walk', text: 'Dōtonbori at night, along the canal', stops: [['Dōtonbori', 135.5024, 34.6690]] }
      ]
    },
    {
      n: 8, title: 'Osaka in the rain', place: 'Osaka', base: 'Osaka', country: 'OS',
      items: [
        { kind: 'see', tags: ['hl', 'history'], text: 'Osaka Castle: the moats, the park, and the view from the top floor', stops: [['Ōtemon Gate', 135.5227, 34.6852], ['Osaka Castle', 135.5259, 34.6866]] },
        { kind: 'food', text: 'Ice cream at the castle', stops: [['Osaka Castle', 135.5263, 34.6862]] },
        { kind: 'walk', stops: [
          ['Shinsaibashi-suji arcade', 135.5014, 34.6749], ['Dōtonbori and the Glico sign', 135.5014, 34.6689], ['Namba', 135.5035, 34.6671] ] },
        { kind: 'food', text: 'Street food around Dōtonbori', stops: [['Dōtonbori', 135.4999, 34.6677]] },
        { kind: 'miss', text: 'Shinsekai and Tsūtenkaku tower (our friends went)', stops: [['Shinsekai', 135.5058, 34.6511]] }
      ]
    },
    {
      n: 9, title: 'Osaka to Hiroshima', place: 'Osaka → Hiroshima', base: 'Hiroshima', country: 'HI',
      travel: { mode: 'Shinkansen', h: 1.5, line: [[135.4991, 34.7327], [132.4750, 34.3972]] },
      items: [
        { kind: 'food', tags: ['hl'], text: 'Hiroshima-style okonomiyaki for lunch', stops: [['Hiroshima', 132.4503, 34.3903]] },
        { kind: 'see', tags: ['hl', 'history', 'tour'], text: 'Hiroshima Peace Memorial Museum', stops: [['Peace Memorial Museum', 132.4527, 34.3918]] },
        { kind: 'walk', tags: ['history'], stops: [
          ['Peace Memorial Park and the Cenotaph', 132.4529, 34.3929], ['Atomic Bomb Dome', 132.4534, 34.3955, 'hl'] ] },
        { kind: 'walk', text: 'Hondōri shopping arcade', stops: [['Hondōri', 132.4569, 34.3937]] },
        { kind: 'food', text: 'Dinner: kamameshi (rice cooked in an iron pot)', stops: [['Hiroshima', 132.4559, 34.3940]] }
      ]
    },
    {
      n: 10, title: 'Miyajima', place: 'Miyajima', base: 'Hiroshima', country: 'HI',
      travel: { mode: 'High-speed boat from Peace Park to Miyajima, and back', h: 0.75, line: [[132.4510, 34.3926], [132.3226, 34.3034]] },
      items: [
        { kind: 'walk', text: 'Peace Memorial Park in the morning', stops: [['Peace Memorial Park', 132.4519, 34.3925]] },
        { kind: 'food', tags: ['hl'], text: 'Grilled oysters on Miyajima', stops: [['Miyajima', 132.3217, 34.3004]] },
        { kind: 'see', tags: ['hl', 'history'], best: 'Best sight', text: 'Itsukushima Shrine and its torii standing in the sea', stops: [['Itsukushima Shrine', 132.3197, 34.2970]] },
        { kind: 'walk', tags: ['nature'], text: 'Momijidani Park', stops: [['Momijidani Park', 132.3256, 34.2937]] },
        { kind: 'see', tags: ['hl', 'nature'], text: 'Ropeway up Mount Misen, then a short hike to the views over the Inland Sea', stops: [['Miyajima Ropeway', 132.3277, 34.2812], ['Mount Misen', 132.3253, 34.2791]] },
        { kind: 'see', text: 'The torii again at sunset, then the boat back', stops: [['Miyajima pier', 132.3226, 34.3034]] },
        { kind: 'food', tags: ['hl'], best: 'Best food', text: 'Teppanyaki dinner in Hiroshima: wagyu, seafood and vegetables on the grill', stops: [['Hiroshima', 132.4549, 34.3941]] },
        { kind: 'see', text: 'The Flame of Peace at night', stops: [['Flame of Peace', 132.4522, 34.3921]] }
      ]
    },
    {
      n: 11, title: 'Hiroshima back to Tokyo', place: 'Hiroshima → Tokyo', base: 'Tokyo (Hamamatsuchō)', country: 'TK',
      travel: { mode: 'Shinkansen', h: 4, line: [[132.4750, 34.3972], [139.7407, 35.6284]] },
      items: [
        { kind: 'food', text: 'An ekiben (station bento) on the Shinkansen' },
        { kind: 'food', text: 'The food halls at Tokyo Station', stops: [['Tokyo Station', 139.7676, 35.6817]] },
        { kind: 'walk', label: 'Evening', stops: [['Yaesu', 139.7711, 35.6815], ['Kyōbashi', 139.7700, 35.6772], ['Ginza at night', 139.7633, 35.6727, 'hl']] },
        { kind: 'see', tags: ['hl'], text: 'Tokyo Tower lit up, and Zōjō-ji below it, near midnight', stops: [['Tokyo Tower', 139.7469, 35.6584], ['Zōjō-ji', 139.7502, 35.6575]] }
      ]
    },
    {
      n: 12, title: 'Tokyo: Ueno, then home', place: 'Tokyo → home', base: null, country: 'TK',
      travel: { mode: 'Train to Narita airport', h: 1, line: [[139.7557, 35.6567], [140.3839, 35.7637]] },
      items: [
        { kind: 'walk', text: 'Ueno Park', stops: [['Ueno Park', 139.7753, 35.7152]] },
        { kind: 'see', tags: ['hl', 'history'], text: 'Tokyo National Museum: samurai swords, Buddhist statues, lacquer and ceramics', stops: [['Tokyo National Museum', 139.7769, 35.7188]] },
        { kind: 'food', text: 'Katsu curry in Akihabara', stops: [['Akihabara', 139.7757, 35.6985]] },
        { kind: 'walk', text: 'Shiba Daimon gate and Hamamatsuchō', stops: [['Shiba Daimon', 139.7557, 35.6567]] }
      ]
    }
  ],
  takeaways: [],
  notes: []
};
