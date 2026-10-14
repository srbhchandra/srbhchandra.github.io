/* Central Europe itinerary: the single source for the page.
   Each day lists items; an item is one line of the itinerary.
     kind:  walk | see | food | miss        (drives come from `drive`)
     stops: places on the map, [name, lon, lat, tags?]; a stop without
            coordinates is listed but not pinned; stop tags as a string, e.g. 'hl history'
     tags:  hl (highlight), nature, history (learnt a lot), tour (ticket or
            guided tour), book (book ahead); best: label for a "best of the trip"
   Day `drive` is the driving waypoints [lon, lat] for routes.json;
   `base` is where the night is spent. */
window.TRIP = {
  countries: {
    CZ: { name: 'Czechia',  color: '#2a78d6' },
    PL: { name: 'Poland',   color: '#eb6834' },
    HU: { name: 'Hungary',  color: '#1baf7a' },
    AT: { name: 'Austria',  color: '#eda100' },
    SI: { name: 'Slovenia', color: '#e87ba4' },
    IT: { name: 'Italy',    color: '#4a3aa7' },
    SK: { name: 'Slovakia', color: null }
  },
  days: [
    {
      n: 1, title: 'Prague, Czechia', place: 'Prague', base: 'Prague', country: 'CZ',
      note: '“City of a Hundred Spires”',
      items: [
        { kind: 'walk', stops: [
          ['Dancing House', 14.4141, 50.0755], ['Hanging Umbrella Man'],
          ['Franz Kafka – Rotating Head', 14.4204, 50.0819],
          ['Man Hanging Out (Sigmund Freud)', 14.4187, 50.0846],
          ['Prague Jewish Quarter', 14.4185, 50.0900],
          ['Prašná brána (climb the tower)', 14.4278, 50.0870] ] },
        { kind: 'walk', label: 'Old Town Square', stops: [
          ['Prague Astronomical Clock', 14.4206, 50.0870],
          ['Památník Jana Husa', 14.4214, 50.0876],
          ['Týn Church', 14.4227, 50.0875],
          ["St. Nicholas' Church", 14.4183, 50.0881] ] },
        { kind: 'walk', stops: [
          ['St. Francis of Assisi Church', 14.4143, 50.0866],
          ['Charles Bridge on the Vltava', 14.4114, 50.0865],
          ['Prague Castle', 14.4005, 50.0905],
          ['St. Vitus Cathedral', 14.4005, 50.0909],
          ['The Golden Lane', 14.4040, 50.0921] ] },
        { kind: 'food', text: 'Trdelník (spit cake) from Old Town Square', stops: [['Old Town Square', 14.4213, 50.0875]] },
        { kind: 'food', text: 'Beef goulash, salami at Lokál Dlouhááá', stops: [['Lokál Dlouhááá', 14.4262, 50.0905]] },
        { kind: 'food', text: 'Cheap beer from the Scout Institute in Old Town Square', stops: [['Scout Institute', 14.4209, 50.0874]] }
      ]
    },
    {
      n: 2, title: 'Prague, then drive to Brno via Kutná Hora', place: 'Prague → Brno', base: 'Brno', country: 'CZ',
      drive: [[14.4206, 50.0870], [15.2886, 49.9620], [16.6068, 49.1951]],
      items: [
        { kind: 'see', text: 'Prague main station', stops: [['Prague main station', 14.4353, 50.0831]] },
        { kind: 'see', text: 'Il Commendatore by Anna Chromý, by the Estates Theatre', stops: [['Il Commendatore', 14.4233, 50.0857]] },
        { kind: 'see', tags: ['hl', 'tour'], text: 'Klementinum (baroque library) – guided tour', stops: [['Klementinum', 14.4163, 50.0864]] },
        { kind: 'see', text: 'Strahov Monastery – museum, baroque library', stops: [['Strahov Monastery', 14.3893, 50.0863]] },
        { kind: 'food', tags: ['hl'], best: 'Best food & beer', text: 'Lunch at Strahov Monastery – best beer and food of the entire trip. Beer: IPA + dark beer brewed by the monastery. Food: pork tenderloin, steak', stops: [['Strahov Monastery Brewery', 14.3897, 50.0861]] },
        { kind: 'see', text: 'Sedlec Ossuary, Kutná Hora (chapel adorned with human skeletons)', stops: [['Sedlec Ossuary', 15.2886, 49.9620]] },
        { kind: 'see', text: 'Ukraine war exhibit, Brno-střed', stops: [['Brno-střed', 16.6068, 49.1951]] },
        { kind: 'food', text: 'Fried grundle fish at Soul Bistro, Brno', stops: [['Soul Bistro']] }
      ]
    },
    {
      n: 3, title: 'Drive to Krakow, Poland from Brno', place: 'Brno → Krakow', base: 'Krakow', country: 'PL',
      drive: [[16.6068, 49.1951], [16.7072, 49.3626], [19.2036, 50.0270], [19.9450, 50.0520]],
      items: [
        { kind: 'see', tags: ['hl', 'nature', 'tour', 'book'], text: 'Moravian Karst (labyrinth of underground caves and stunning rock formations) – guided tour', stops: [
          ['Skalní mlýn', 16.7072, 49.3626], ['Punkva Caves', 16.7243, 49.3720], ['Macocha Abyss (take the funicular)', 16.7300, 49.3735] ] },
        { kind: 'see', tags: ['hl', 'history', 'tour', 'book'], text: 'Memorial and Museum Auschwitz-Birkenau', stops: [['Auschwitz-Birkenau Memorial', 19.2036, 50.0270]] },
        { kind: 'food', text: 'Dinner at Hamsa, Kazimierz Jewish Quarter', stops: [['Hamsa', 19.9467, 50.0520]] }
      ]
    },
    {
      n: 4, title: 'Krakow, Poland', place: 'Krakow', base: 'Krakow', country: 'PL',
      items: [
        { kind: 'walk', label: 'Stare Miasto (historic center)', stops: [
          ["St. Florian's Gate", 19.9415, 50.0652], ['Main Market Square (Rynek Główny)', 19.9373, 50.0617],
          ["St. Mary's Basilica", 19.9394, 50.0616], ['Rynek Underground Museum', 19.9370, 50.0619, 'hl history'],
          ['The Cloth Hall', 19.9373, 50.0617], ['Basilica of St. Francis', 19.9353, 50.0581],
          ['Town Hall Tower (climb up)', 19.9362, 50.0614], ['Planty gardens', 19.9330, 50.0605] ] },
        { kind: 'walk', stops: [
          ['Wawel Royal Castle and cathedral', 19.9354, 50.0540], ['Wejście do Smoczej Jamy (cave under the castle)', 19.9334, 50.0533],
          ['Fire-breathing dragon statue', 19.9330, 50.0532], ['Vistula river', 19.9325, 50.0525] ] },
        { kind: 'walk', stops: [['Kazimierz Jewish Quarter', 19.9448, 50.0510]] },
        { kind: 'food', text: 'Apple strudel, apple pie with ice cream around Stare Miasto' },
        { kind: 'food', text: 'Pierogi from Mirror Bistro – Pierogi Bystro, Kazimierz' },
        { kind: 'food', text: 'Sausage with onions from Bar & Grill Na Kazimierzu, Kazimierz' }
      ]
    },
    {
      n: 5, title: 'Wieliczka and Zakopane, Poland', place: 'Zakopane', base: 'Zakopane', country: 'PL',
      drive: [[19.9450, 50.0520], [20.0558, 49.9832], [19.9502, 49.2960]],
      items: [
        { kind: 'see', tags: ['hl', 'tour'], text: 'Wieliczka Salt Mine, an underground marvel with intricate salt sculptures and chapels', stops: [['Wieliczka Salt Mine', 20.0558, 49.9832]] },
        { kind: 'see', tags: ['nature'], text: 'Zakopane – the Polish side of the Tatra Mountains: rugged peaks, glacial lakes and deep valleys' },
        { kind: 'see', tags: ['nature'], text: 'Gubałówka – take the funicular up the hill, hike down; good views of the valley', stops: [['Gubałówka', 19.9370, 49.3045]] },
        { kind: 'walk', stops: [['Centrum Miasta (downtown)', 19.9502, 49.2960]] },
        { kind: 'food', text: 'Smoked sheep cheese' },
        { kind: 'food', tags: ['hl'], text: 'Mulled wine, hot mead from Gazdowo Kuźnia', stops: [['Gazdowo Kuźnia', 19.9530, 49.2975]] }
      ]
    },
    {
      n: 6, title: 'Drive to Budapest, Hungary via Slovakia', place: 'Tatras → Budapest', base: 'Budapest', country: 'HU', via: ['SK'],
      drive: [[19.9502, 49.2960], [20.2275, 49.2737], [19.0400, 47.4979]],
      items: [
        { kind: 'food', text: 'Excellent breakfast at Restauracja Zakopiańska – tried bliny gryczane', stops: [['Restauracja Zakopiańska', 19.9630, 49.2968]] },
        { kind: 'see', tags: ['nature'], text: 'Tatra National Park – hike up Sarnia Skała for views', stops: [['Sarnia Skała', 19.9410, 49.2649]] },
        { kind: 'see', tags: ['nature'], text: 'Drive through Slovakia with views of the Tatras; stop at Ždiar for photos', stops: [['Ždiar', 20.2275, 49.2737]] },
        { kind: 'miss', text: 'An extra day in the Tatras: stay on the Slovak side, and hike to Morskie Oko (on the Polish side)', stops: [['Morskie Oko', 20.0707, 49.1974]] }
      ]
    },
    {
      n: 7, title: 'Budapest, Hungary', place: 'Budapest', base: 'Budapest', country: 'HU',
      items: [
        { kind: 'walk', label: 'Castle district', stops: [
          ['Vienna Gate', 19.0305, 47.5047], ['Matthias Church (climb the tower)', 19.0344, 47.5019],
          ["Fisherman's Bastion", 19.0350, 47.5022], ['Buda Castle', 19.0396, 47.4962],
          ['Budapest History Museum / Castle Museum', 19.0395, 47.4955], ['Várkert Bazár', 19.0434, 47.4963] ] },
        { kind: 'food', text: 'Desserts from Ruszwurm Confectionery, Castle district', stops: [['Ruszwurm', 19.0333, 47.5017]] },
        { kind: 'walk', stops: [
          ['Hungarian Parliament, from outside (the tour is on day 8)', 19.0457, 47.5071],
          ["St. Stephen's Basilica (climb the tower)", 19.0539, 47.5008],
          ['Vörösmarty tér – very happening', 19.0510, 47.4970] ] },
        { kind: 'see', tags: ['tour'], text: "Danube night cruise to admire the city's landmarks", stops: [['Danube cruise pier', 19.0480, 47.4960]] },
        { kind: 'miss', text: 'Central Market Hall', stops: [['Central Market Hall', 19.0585, 47.4870]] }
      ]
    },
    {
      n: 8, title: 'Budapest, then drive to Vienna, Austria via Slovakia', place: 'Budapest → Vienna', base: 'Vienna', country: 'AT', via: ['SK'],
      drive: [[19.0457, 47.5071], [18.7406, 47.4403], [17.1077, 48.1437], [16.3731, 48.2085]],
      items: [
        { kind: 'walk', stops: [
          ['Széchenyi Thermal Bath', 19.0819, 47.5186], ['Gatehouse Tower', 19.0815, 47.5155],
          ['Vajdahunyad Castle', 19.0820, 47.5150], ['Museum of Ethnography', 19.0759, 47.5193] ] },
        { kind: 'see', tags: ['hl', 'tour'], text: 'Hungarian Parliament Building – guided tour', stops: [['Hungarian Parliament', 19.0457, 47.5071]] },
        { kind: 'food', text: 'A very beautiful café – Ohana, the coffee family, Budapest' },
        { kind: 'food', text: 'Etyeki Manor vineyard, Etyek', stops: [['Etyek', 18.7406, 47.4403]] },
        { kind: 'walk', label: 'Bratislava, Slovakia', stops: [['Bratislava Castle', 17.1000, 48.1421], ['Old Town', 17.1077, 48.1437]] }
      ]
    },
    {
      n: 9, title: 'Vienna, Austria', place: 'Vienna', base: 'Vienna', country: 'AT',
      items: [
        { kind: 'walk', label: 'Innere Stadt', stops: [
          ['Naschmarkt', 16.3623, 48.1983], ["St. Charles's Church", 16.3717, 48.1983],
          ['Vienna State Opera', 16.3692, 48.2031], ['Michaelerplatz', 16.3667, 48.2080] ] },
        { kind: 'food', text: 'Late breakfast at Café Demel: Viennese coffee and pastries, such as Sachertorte and Apfelstrudel', stops: [['Café Demel', 16.3673, 48.2087]] },
        { kind: 'walk', stops: [
          ['Austrian National Library', 16.3670, 48.2066], ['Spanish Riding School', 16.3664, 48.2075], ['The Hofburg', 16.3653, 48.2066],
          ['Kunsthistorisches Museum', 16.3617, 48.2038], ['Parliament (no guided tour)', 16.3586, 48.2083],
          ['Rathausplatz', 16.3575, 48.2105] ] },
        { kind: 'see', text: 'Hundertwasser House and Village', stops: [['Hundertwasser House', 16.3944, 48.2072]] },
        { kind: 'walk', stops: [["St. Stephen's Cathedral (elevator up the tower)", 16.3731, 48.2085], ['Albertina', 16.3683, 48.2045]] },
        { kind: 'see', tags: ['tour'], text: 'Watch the opera “Daphne” at the Vienna State Opera', stops: [['Vienna State Opera', 16.3692, 48.2031]] }
      ]
    },
    {
      n: 10, title: 'Vienna, then drive to Slovenia', place: 'Vienna → Slovenia', base: 'Kranjska Gora', country: 'SI',
      drive: [[16.3122, 48.1845], [16.8310, 47.8504], [13.7850, 46.4847]],
      items: [
        { kind: 'see', tags: ['tour'], text: 'Schönbrunn Palace (Habsburg architecture) – audio-guided tour', stops: [['Schönbrunn Palace', 16.3122, 48.1845]] },
        { kind: 'food', tags: ['hl'], text: 'Heuriger at Fabian Inh. Johann Sloboda, Podersdorf am See – a small family vineyard pouring its own wine; an amazing experience', stops: [['Podersdorf am See', 16.8310, 47.8504]] }
      ]
    },
    {
      n: 11, title: 'Kranjska Gora, Slovenia', place: 'Kranjska Gora', base: 'Kranjska Gora', country: 'SI',
      drive: [[13.7850, 46.4847], [13.7841, 46.4718], [13.7436, 46.4339], [13.7850, 46.4847]],
      items: [
        { kind: 'see', tags: ['nature'], text: 'Lake Jasna', stops: [['Lake Jasna', 13.7841, 46.4718]] },
        { kind: 'see', tags: ['nature'], text: 'Drive through Triglav National Park up to the Vršič Pass and back', stops: [['Vršič Pass', 13.7436, 46.4339]] }
      ]
    },
    {
      n: 12, title: 'Bled, then drive to the Dolomites, Italy', place: 'Bled → Dolomites', base: 'Colle Santa Lucia', country: 'IT',
      drive: [[13.7850, 46.4847], [14.0927, 46.3986], [14.0938, 46.3683], [14.1270, 45.8156], [12.0138, 46.4479]],
      items: [
        { kind: 'see', tags: ['hl', 'nature'], best: 'Best nature', text: 'Vintgar Gorge – the best nature of the trip: blue, green and yellow water in the gorge', stops: [['Vintgar Gorge', 14.0927, 46.3986]] },
        { kind: 'see', tags: ['nature'], text: 'Lake Bled, with its island', stops: [['Lake Bled', 14.0938, 46.3625]] },
        { kind: 'food', text: 'Bled cream cake', stops: [['Bled', 14.1100, 46.3680]] },
        { kind: 'see', tags: ['hl'], text: 'Mountain coaster on Straža hill, Bled – super fun', stops: [['Mountain coaster, Straža', 14.1051, 46.3626]] },
        { kind: 'see', text: 'Predjama Castle – seen from outside', stops: [['Predjama Castle', 14.1270, 45.8156]] },
        { kind: 'miss', text: 'Postojna Cave or Škocjan Caves', stops: [['Postojna Cave', 14.2034, 45.7826], ['Škocjan Caves', 13.9895, 45.6634]] }
      ]
    },
    {
      n: 13, title: 'The Dolomites, Italy', place: 'Dolomites', base: 'Colle Santa Lucia', country: 'IT',
      drive: [[12.0138, 46.4479], [12.0540, 46.4831], [12.0084, 46.5192], [12.1174, 46.5258], [12.1357, 46.5369], [12.0138, 46.4479]],
      items: [
        { kind: 'see', tags: ['hl', 'nature'], best: 'Best drive', text: 'The best drive, with many hairpin bends', stops: [
          ['Passo Giau', 12.0540, 46.4831], ['Cascate di Limedes'], ['Lagazuoi cable car (skipped: the top was in cloud)', 12.0084, 46.5192],
          ['Belvedere di Pocol', 12.1174, 46.5258], ['Punto Panoramico'], ['Parcheggio Belvedere'] ] },
        { kind: 'walk', stops: [["Cortina d'Ampezzo", 12.1357, 46.5369]] },
        { kind: 'food', text: 'Hot chocolate from Pasticceria Panificio Alverà, Cortina', stops: [['Pasticceria Alverà', 12.1365, 46.5380]] }
      ]
    },
    {
      n: 14, title: 'The Dolomites, then drive to Venice', place: 'Dolomites → Venice', base: 'Venice', country: 'IT',
      drive: [[12.0138, 46.4479], [12.0215, 46.4078], [11.9947, 46.2210], [12.0419, 46.1878], [12.0624, 46.1657], [12.2334, 45.4827]],
      items: [
        { kind: 'see', tags: ['nature'], text: 'Lake Alleghe', stops: [['Lake Alleghe', 12.0215, 46.4078]] },
        { kind: 'see', tags: ['hl', 'nature'], text: 'Dolomiti Bellunesi National Park', stops: [
          ['Valle del Mis – stopped just for fun', 11.9947, 46.2210], ['Cadini del Brenton', 12.0419, 46.1878], ['Lago del Mis', 12.0624, 46.1657], ['Sentiero Natura Val Falcina'] ] },
        { kind: 'see', text: 'Leave the car in Mestre and cross the causeway into Venice', stops: [['Mestre', 12.2334, 45.4827]] },
        { kind: 'walk', label: 'Venice, on foot and by boat', stops: [
          ['Venezia Santa Lucia station', 12.3210, 45.4410], ['Rialto Bridge (from the boat)', 12.3359, 45.4380],
          ['Basilica dei Frari', 12.3263, 45.4370], ["St. Mark's Square", 12.3388, 45.4341],
          ["Doge's Palace", 12.3401, 45.4337], ["St. Mark's Basilica", 12.3397, 45.4345],
          ['National Archaeological Museum', 12.3383, 45.4338] ] }
      ]
    }
  ],
  takeaways: [
    'Most of what you’ll see is Gothic, Renaissance or Baroque, or a 19th-century “neo” revival of one of them. Learn those three and every old town starts to make sense.',
    'Old towns are built for walking; cars are an afterthought. It’s the opposite of the US.',
    'Many older buildings have no lift, so people of every age climb stairs every day, and it shows.',
    'Milk and butter taste noticeably better than at home.',
    'Water can cost more than beer. In Krakow it even carried 23% tax.',
    'Beer is mostly mild and pale, made for drinking a lot of it.',
    'Public toilets usually cost a coin or two; carry change.',
    'Every bathroom in every apartment has its own quirk.',
    'Parking is often extra at hotels and apartments. Check before booking if you’re driving.'
  ]
};
