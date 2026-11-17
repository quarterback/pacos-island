/* Paco's Island: answer universes.

   Every question is a cut of one closed list below. Each line is one item:
     Display name|other accepted spelling|=another real name for it
   A plain alias is accepted when typed. An alias starting with "=" is a real
   name for the item (Ivory Coast, Czech Republic), so it also counts when a
   question asks about letters in the name.

   tier is a hand guess at how often players think of an item, from
   1 (almost everyone) to 5 (almost no one). tools/rarity.py blends it with
   how often each name appears in English text to build js/rarity.js, the
   fixed familiarity score each item carries as fam. */
'use strict';
const Data = (() => {
  const parse = (text, tiers, defaultTier, extra) => text.trim().split('\n').map((line) => {
    const [name, ...rest] = line.trim().split('|');
    const aliases = [], names = [name];
    for (const a of rest) { if (a.startsWith('=')) { names.push(a.slice(1)); aliases.push(a.slice(1)); } else aliases.push(a); }
    let tier = defaultTier;
    for (const t of [1, 2, 3, 4, 5]) if (tiers[t] && tiers[t].includes(name)) tier = t;
    const item = { name, aliases, names, tier };
    if (extra && extra[name]) Object.assign(item, extra[name]);
    return item;
  });

  const COUNTRIES = parse(`
Afghanistan
Albania
Algeria
Andorra
Angola
Antigua and Barbuda|Antigua
Argentina
Armenia
Australia
Austria
Azerbaijan
Bahamas|The Bahamas
Bahrain
Bangladesh
Barbados
Belarus
Belgium
Belize
Benin
Bhutan
Bolivia
Bosnia and Herzegovina|Bosnia|Bosnia Herzegovina
Botswana
Brazil|Brasil
Brunei|Brunei Darussalam
Bulgaria
Burkina Faso
Burundi
Cabo Verde|=Cape Verde
Cambodia
Cameroon
Canada
Central African Republic|CAR
Chad
Chile
China|PRC
Colombia
Comoros
Congo|Republic of the Congo|Congo Brazzaville|Congo-Brazzaville
Costa Rica
Côte d'Ivoire|=Ivory Coast|Cote d'Ivoire|Cote dIvoire
Croatia
Cuba
Cyprus
Czechia|=Czech Republic
Democratic Republic of the Congo|DRC|DR Congo|Congo Kinshasa|Congo-Kinshasa
Denmark
Djibouti
Dominica
Dominican Republic
Ecuador
Egypt
El Salvador|Salvador
Equatorial Guinea
Eritrea
Estonia
Eswatini|=Swaziland
Ethiopia
Fiji
Finland
France
Gabon
Gambia|The Gambia
Georgia
Germany|Deutschland
Ghana
Greece
Grenada
Guatemala
Guinea
Guinea-Bissau|Guinea Bissau
Guyana
Haiti
Honduras
Hungary
Iceland
India
Indonesia
Iran
Iraq
Ireland
Israel
Italy
Jamaica
Japan
Jordan
Kazakhstan
Kenya
Kiribati
Kuwait
Kyrgyzstan
Laos
Latvia
Lebanon
Lesotho
Liberia
Libya
Liechtenstein
Lithuania
Luxembourg
Madagascar
Malawi
Malaysia
Maldives
Mali
Malta
Marshall Islands
Mauritania
Mauritius
Mexico|México
Micronesia|Federated States of Micronesia
Moldova
Monaco
Mongolia
Montenegro
Morocco
Mozambique
Myanmar|=Burma
Namibia
Nauru
Nepal
Netherlands|The Netherlands|Holland
New Zealand
Nicaragua
Niger
Nigeria
North Korea|DPRK
North Macedonia|Macedonia
Norway
Oman
Pakistan
Palau
Panama
Papua New Guinea|PNG
Paraguay
Peru
Philippines|The Philippines
Poland
Portugal
Qatar
Romania
Russia|Russian Federation
Rwanda
Saint Kitts and Nevis|St Kitts and Nevis|St. Kitts and Nevis
Saint Lucia|St Lucia|St. Lucia
Saint Vincent and the Grenadines|St Vincent and the Grenadines|St. Vincent and the Grenadines
Samoa
San Marino
São Tomé and Príncipe|Sao Tome and Principe|Sao Tome
Saudi Arabia
Senegal
Serbia
Seychelles
Sierra Leone
Singapore
Slovakia
Slovenia
Solomon Islands
Somalia
South Africa
South Korea|Korea|Republic of Korea
South Sudan
Spain|España
Sri Lanka
Sudan
Suriname
Sweden
Switzerland
Syria
Tajikistan
Tanzania
Thailand
Timor-Leste|=East Timor|Timor Leste
Togo
Tonga
Trinidad and Tobago|Trinidad
Tunisia
Turkey|=Türkiye|Turkiye
Turkmenistan
Tuvalu
Uganda
Ukraine
United Arab Emirates|UAE|Emirates
United Kingdom|UK|U.K.|Great Britain|Britain
United States|USA|US|U.S.|U.S.A.|United States of America|America
Uruguay
Uzbekistan
Vanuatu
Venezuela
Vietnam|Viet Nam
Yemen
Zambia
Zimbabwe`, {
    1: ['United States', 'Canada', 'Mexico', 'Brazil', 'China', 'Japan', 'France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'Russia', 'India', 'Australia', 'Egypt', 'Argentina', 'Switzerland', 'Greece', 'Ireland', 'Sweden', 'South Africa', 'Portugal', 'Netherlands', 'Belgium', 'Bolivia', 'Bulgaria', 'Poland', 'Peru', 'Chile', 'Cuba', 'Norway'],
    2: ['Colombia', 'Venezuela', 'Ecuador', 'Nigeria', 'Kenya', 'Morocco', 'Turkey', 'Iran', 'Iraq', 'Israel', 'Pakistan', 'Afghanistan', 'Vietnam', 'Thailand', 'South Korea', 'North Korea', 'Indonesia', 'Philippines', 'New Zealand', 'Finland', 'Denmark', 'Austria', 'Hungary', 'Ukraine', 'Iceland', 'Jamaica', 'Haiti', 'Panama', 'Costa Rica', 'Uruguay', 'Paraguay', 'Saudi Arabia', 'Ethiopia', 'Ghana', 'Bosnia and Herzegovina', 'Croatia', 'Serbia', 'Romania', 'Czechia', 'Bangladesh', 'Belarus', 'Barbados', 'Bahamas', 'Bhutan', 'Belize', 'Kazakhstan', 'Mongolia', 'Nepal', 'Lebanon', 'Syria', 'Jordan', 'Somalia', 'Sudan', 'Libya', 'Algeria', 'Tunisia', 'Uganda', 'Rwanda', 'Zimbabwe', 'Madagascar', 'Singapore', 'Malaysia', 'Cambodia', 'Sri Lanka', 'Fiji', 'Honduras', 'Guatemala', 'Nicaragua', 'El Salvador', 'Dominican Republic', 'Luxembourg', 'Monaco', 'United Arab Emirates', 'Qatar', 'Uzbekistan', 'Tanzania', 'Botswana', 'Namibia', 'Angola', 'Senegal', 'Cameroon', 'Albania', 'Estonia', 'Latvia', 'Lithuania', 'Slovakia', 'Slovenia', 'Georgia', 'Armenia', 'Azerbaijan', 'Bahrain', 'Kuwait', 'Oman', 'Yemen', 'Liechtenstein', 'Andorra', 'San Marino', 'Malta', 'Cyprus', 'Laos', 'Myanmar', 'Trinidad and Tobago', 'Zambia', 'Mozambique', 'Congo', 'Democratic Republic of the Congo', 'Côte d\'Ivoire', 'Papua New Guinea', 'Maldives', 'Chad', 'Mali', 'Niger'],
    3: ['Bahrain', 'Kuwait', 'Oman', 'Yemen', 'Liechtenstein', 'Andorra', 'San Marino', 'Malta', 'Cyprus', 'Laos', 'Myanmar', 'Trinidad and Tobago', 'Zambia', 'Mozambique', 'Congo', 'Democratic Republic of the Congo', 'Côte d\'Ivoire', 'Papua New Guinea', 'Maldives', 'Chad', 'Mali', 'Niger', 'Albania', 'Estonia', 'Latvia', 'Lithuania', 'Slovakia', 'Slovenia', 'Georgia', 'Armenia', 'Azerbaijan', 'Uzbekistan', 'Tanzania', 'Botswana', 'Namibia', 'Angola', 'Senegal', 'Cameroon', 'Belarus', 'Barbados', 'Bahamas', 'Bhutan', 'Belize', 'Mongolia', 'Nepal', 'Luxembourg', 'Monaco', 'Qatar', 'Honduras', 'Guatemala', 'Nicaragua', 'El Salvador', 'Fiji', 'Sri Lanka', 'Cambodia', 'Zimbabwe', 'Rwanda', 'Uganda', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'Somalia', 'Lebanon', 'Syria', 'Jordan', 'Kazakhstan', 'Madagascar', 'Bosnia and Herzegovina', 'Bangladesh', 'Ethiopia', 'Ghana', 'Serbia', 'Croatia', 'Romania'],
    4: ['Benin', 'Burundi', 'Brunei', 'Burkina Faso', 'Cabo Verde', 'Comoros', 'Djibouti', 'Eritrea', 'Eswatini', 'Gabon', 'Gambia', 'Guinea', 'Guinea-Bissau', 'Equatorial Guinea', 'Lesotho', 'Liberia', 'Malawi', 'Mauritania', 'Mauritius', 'Seychelles', 'Sierra Leone', 'South Sudan', 'Togo', 'Central African Republic', 'Kyrgyzstan', 'Tajikistan', 'Turkmenistan', 'Moldova', 'Montenegro', 'North Macedonia', 'Timor-Leste', 'Suriname', 'Guyana', 'Grenada', 'Dominica', 'Saint Lucia', 'Antigua and Barbuda', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands'],
    5: ['Kiribati', 'Tuvalu', 'Nauru', 'Palau', 'Marshall Islands', 'Micronesia', 'Saint Kitts and Nevis', 'Saint Vincent and the Grenadines', 'São Tomé and Príncipe'],
  }, 3, {});

  const LANDLOCKED = ['Afghanistan', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Bhutan', 'Bolivia', 'Botswana', 'Burkina Faso', 'Burundi', 'Central African Republic', 'Chad', 'Czechia', 'Eswatini', 'Ethiopia', 'Hungary', 'Kazakhstan', 'Kyrgyzstan', 'Laos', 'Lesotho', 'Liechtenstein', 'Luxembourg', 'Malawi', 'Mali', 'Moldova', 'Mongolia', 'Nepal', 'Niger', 'North Macedonia', 'Paraguay', 'Rwanda', 'San Marino', 'Serbia', 'Slovakia', 'South Sudan', 'Switzerland', 'Tajikistan', 'Turkmenistan', 'Uganda', 'Uzbekistan', 'Zambia', 'Zimbabwe'];

  const US_STATES = parse(`
Alabama
Alaska
Arizona
Arkansas
California|Cali
Colorado
Connecticut
Delaware
Florida
Georgia
Hawaii|Hawai'i
Idaho
Illinois
Indiana
Iowa
Kansas
Kentucky
Louisiana
Maine
Maryland
Massachusetts
Michigan
Minnesota
Mississippi
Missouri
Montana
Nebraska
Nevada
New Hampshire
New Jersey
New Mexico
New York
North Carolina
North Dakota
Ohio
Oklahoma
Oregon
Pennsylvania
Rhode Island
South Carolina
South Dakota
Tennessee
Texas
Utah
Vermont
Virginia
Washington
West Virginia
Wisconsin
Wyoming`, {
    1: ['California', 'Texas', 'Florida', 'New York', 'Hawaii', 'Alaska'],
    2: ['Washington', 'Oregon', 'Arizona', 'Nevada', 'Colorado', 'Illinois', 'Ohio', 'Michigan', 'Georgia', 'Massachusetts', 'New Jersey', 'Pennsylvania', 'Virginia', 'North Carolina', 'Tennessee', 'Louisiana', 'Utah', 'Kentucky', 'Alabama', 'Mississippi'],
    4: ['Delaware', 'Rhode Island', 'Vermont', 'North Dakota', 'South Dakota', 'Wyoming', 'Idaho', 'Nebraska', 'Arkansas', 'West Virginia', 'New Hampshire', 'Connecticut'],
  }, 3);

  const MX_STATES = parse(`
Aguascalientes
Baja California
Baja California Sur
Campeche
Chiapas
Chihuahua
Coahuila
Colima
Durango
Guanajuato
Guerrero
Hidalgo
Jalisco
Estado de México|State of Mexico|Mexico State|Edomex|Estado de Mexico
Michoacán|Michoacan
Morelos
Nayarit
Nuevo León|Nuevo Leon
Oaxaca
Puebla
Querétaro|Queretaro
Quintana Roo
San Luis Potosí|San Luis Potosi
Sinaloa
Sonora
Tabasco
Tamaulipas
Tlaxcala
Veracruz
Yucatán|Yucatan
Zacatecas
Ciudad de México|Mexico City|CDMX|Ciudad de Mexico`, {
    1: ['Jalisco', 'Baja California', 'Ciudad de México', 'Oaxaca', 'Chihuahua', 'Yucatán', 'Quintana Roo'],
    2: ['Baja California Sur', 'Sonora', 'Sinaloa', 'Veracruz', 'Puebla', 'Guerrero', 'Michoacán', 'Nuevo León', 'Chiapas', 'Guanajuato', 'Nayarit'],
    4: ['Aguascalientes', 'Tlaxcala', 'Colima', 'Campeche', 'Morelos', 'Hidalgo', 'Tabasco', 'Querétaro'],
  }, 3);
  const MX_PACIFIC = ['Baja California', 'Baja California Sur', 'Sonora', 'Sinaloa', 'Nayarit', 'Jalisco', 'Colima', 'Michoacán', 'Guerrero', 'Oaxaca', 'Chiapas'];

  // US spelling is the display name; British spellings are accepted when typed.
  const ELEMENTS = parse(`
Hydrogen
Helium
Lithium
Beryllium
Boron
Carbon
Nitrogen
Oxygen
Fluorine
Neon
Sodium
Magnesium
Aluminum|Aluminium
Silicon
Phosphorus
Sulfur|Sulphur
Chlorine
Argon
Potassium
Calcium
Scandium
Titanium
Vanadium
Chromium
Manganese
Iron
Cobalt
Nickel
Copper
Zinc
Gallium
Germanium
Arsenic
Selenium
Bromine
Krypton
Rubidium
Strontium
Yttrium
Zirconium
Niobium
Molybdenum
Technetium
Ruthenium
Rhodium
Palladium
Silver
Cadmium
Indium
Tin
Antimony
Tellurium
Iodine
Xenon
Cesium|Caesium
Barium
Lanthanum
Cerium
Praseodymium
Neodymium
Promethium
Samarium
Europium
Gadolinium
Terbium
Dysprosium
Holmium
Erbium
Thulium
Ytterbium
Lutetium
Hafnium
Tantalum
Tungsten
Rhenium
Osmium
Iridium
Platinum
Gold
Mercury
Thallium
Lead
Bismuth
Polonium
Astatine
Radon
Francium
Radium
Actinium
Thorium
Protactinium
Uranium
Neptunium
Plutonium
Americium
Curium
Berkelium
Californium
Einsteinium
Fermium
Mendelevium
Nobelium
Lawrencium
Rutherfordium
Dubnium
Seaborgium
Bohrium
Hassium
Meitnerium
Darmstadtium
Roentgenium
Copernicium
Nihonium
Flerovium
Moscovium
Livermorium
Tennessine
Oganesson`, {
    1: ['Hydrogen', 'Oxygen', 'Carbon', 'Gold', 'Iron', 'Helium', 'Nitrogen', 'Silver'],
    2: ['Copper', 'Sodium', 'Calcium', 'Neon', 'Lead', 'Zinc', 'Uranium', 'Aluminum', 'Chlorine', 'Mercury', 'Potassium', 'Tin', 'Platinum', 'Lithium', 'Silicon', 'Plutonium', 'Titanium', 'Magnesium', 'Sulfur', 'Nickel', 'Argon', 'Fluorine', 'Phosphorus', 'Iodine'],
    4: ['Scandium', 'Vanadium', 'Gallium', 'Germanium', 'Selenium', 'Rubidium', 'Strontium', 'Yttrium', 'Zirconium', 'Niobium', 'Molybdenum', 'Technetium', 'Ruthenium', 'Rhodium', 'Palladium', 'Cadmium', 'Indium', 'Antimony', 'Tellurium', 'Lanthanum', 'Cerium', 'Hafnium', 'Tantalum', 'Rhenium', 'Osmium', 'Iridium', 'Thallium', 'Bismuth', 'Polonium', 'Astatine', 'Francium', 'Actinium', 'Thorium', 'Neptunium', 'Americium', 'Curium', 'Einsteinium', 'Fermium', 'Nobelium', 'Europium', 'Gadolinium'],
    5: ['Praseodymium', 'Neodymium', 'Promethium', 'Samarium', 'Terbium', 'Dysprosium', 'Holmium', 'Erbium', 'Thulium', 'Ytterbium', 'Lutetium', 'Protactinium', 'Berkelium', 'Californium', 'Mendelevium', 'Lawrencium', 'Rutherfordium', 'Dubnium', 'Seaborgium', 'Bohrium', 'Hassium', 'Meitnerium', 'Darmstadtium', 'Roentgenium', 'Copernicium', 'Nihonium', 'Flerovium', 'Moscovium', 'Livermorium', 'Tennessine', 'Oganesson'],
  }, 3);

  // Team nicknames. A nickname shared by two leagues (Giants, Kings) is one
  // item in the combined list and two items in the league lists.
  const NBA = parse(`
Hawks|Atlanta Hawks
Celtics|Boston Celtics
Nets|Brooklyn Nets
Hornets|Charlotte Hornets
Bulls|Chicago Bulls
Cavaliers|Cavs|Cleveland Cavaliers
Mavericks|Mavs|Dallas Mavericks
Nuggets|Denver Nuggets
Pistons|Detroit Pistons
Warriors|Golden State Warriors|Dubs
Rockets|Houston Rockets
Pacers|Indiana Pacers
Clippers|Los Angeles Clippers|LA Clippers
Lakers|Los Angeles Lakers|LA Lakers
Grizzlies|Memphis Grizzlies|Grizz
Heat|Miami Heat
Bucks|Milwaukee Bucks
Timberwolves|Wolves|Minnesota Timberwolves|T-Wolves
Pelicans|Pels|New Orleans Pelicans
Knicks|New York Knicks
Thunder|Oklahoma City Thunder|OKC
Magic|Orlando Magic
76ers|Sixers|Philadelphia 76ers|Seventy Sixers
Suns|Phoenix Suns
Trail Blazers|Blazers|Portland Trail Blazers|Trailblazers
Kings|Sacramento Kings
Spurs|San Antonio Spurs
Raptors|Toronto Raptors
Jazz|Utah Jazz
Wizards|Washington Wizards`, {
    1: ['Lakers', 'Celtics', 'Bulls', 'Warriors', 'Knicks', 'Heat'],
    2: ['Spurs', 'Rockets', 'Mavericks', 'Suns', 'Nets', 'Clippers', '76ers', 'Raptors', 'Cavaliers', 'Pistons', 'Thunder', 'Magic', 'Jazz'],
    4: ['Pelicans', 'Grizzlies', 'Hornets', 'Wizards', 'Pacers'],
  }, 3);

  const NFL = parse(`
Cardinals|Arizona Cardinals
Falcons|Atlanta Falcons
Ravens|Baltimore Ravens
Bills|Buffalo Bills
Panthers|Carolina Panthers
Bears|Chicago Bears
Bengals|Cincinnati Bengals
Browns|Cleveland Browns
Cowboys|Dallas Cowboys
Broncos|Denver Broncos
Lions|Detroit Lions
Packers|Green Bay Packers
Texans|Houston Texans
Colts|Indianapolis Colts
Jaguars|Jags|Jacksonville Jaguars
Chiefs|Kansas City Chiefs
Raiders|Las Vegas Raiders
Chargers|Los Angeles Chargers
Rams|Los Angeles Rams
Dolphins|Miami Dolphins
Vikings|Minnesota Vikings
Patriots|Pats|New England Patriots
Saints|New Orleans Saints
Giants|New York Giants
Jets|New York Jets
Eagles|Philadelphia Eagles
Steelers|Pittsburgh Steelers
49ers|Niners|San Francisco 49ers|Forty Niners
Seahawks|Seattle Seahawks
Buccaneers|Bucs|Tampa Bay Buccaneers
Titans|Tennessee Titans
Commanders|Washington Commanders`, {
    1: ['Cowboys', 'Patriots', 'Packers', 'Steelers', '49ers', 'Chiefs', 'Eagles', 'Giants', 'Bears'],
    2: ['Raiders', 'Dolphins', 'Broncos', 'Seahawks', 'Jets', 'Rams', 'Vikings', 'Saints', 'Lions', 'Bills', 'Ravens'],
    4: ['Texans', 'Titans', 'Jaguars', 'Commanders', 'Cardinals'],
  }, 3);

  const MLB = parse(`
Diamondbacks|D-backs|Dbacks|Arizona Diamondbacks
Braves|Atlanta Braves
Orioles|O's|Baltimore Orioles
Red Sox|Boston Red Sox|Sox
Cubs|Chicago Cubs
White Sox|Chicago White Sox
Reds|Cincinnati Reds
Guardians|Cleveland Guardians
Rockies|Colorado Rockies
Tigers|Detroit Tigers
Astros|Houston Astros
Royals|Kansas City Royals
Angels|Los Angeles Angels
Dodgers|Los Angeles Dodgers
Marlins|Miami Marlins
Brewers|Milwaukee Brewers
Twins|Minnesota Twins
Mets|New York Mets
Yankees|New York Yankees|Yanks
Athletics|A's|Oakland Athletics
Phillies|Philadelphia Phillies
Pirates|Pittsburgh Pirates|Bucs
Padres|San Diego Padres
Giants|San Francisco Giants
Mariners|Seattle Mariners|M's
Cardinals|St. Louis Cardinals|St Louis Cardinals|Cards
Rays|Tampa Bay Rays
Rangers|Texas Rangers
Blue Jays|Jays|Toronto Blue Jays
Nationals|Nats|Washington Nationals`, {
    1: ['Yankees', 'Red Sox', 'Dodgers', 'Cubs', 'Mets', 'Giants', 'Cardinals'],
    2: ['Braves', 'Astros', 'Phillies', 'White Sox', 'Mariners', 'Padres', 'Tigers', 'Blue Jays', 'Orioles', 'Rangers', 'Athletics', 'Pirates'],
    4: ['Rockies', 'Marlins', 'Royals', 'Guardians', 'Diamondbacks', 'Nationals'],
  }, 3);

  const NHL = parse(`
Ducks|Anaheim Ducks
Bruins|Boston Bruins
Sabres|Buffalo Sabres
Flames|Calgary Flames
Hurricanes|Canes|Carolina Hurricanes
Blackhawks|Hawks|Chicago Blackhawks
Avalanche|Avs|Colorado Avalanche
Blue Jackets|Columbus Blue Jackets
Stars|Dallas Stars
Red Wings|Wings|Detroit Red Wings
Oilers|Edmonton Oilers
Panthers|Florida Panthers
Kings|Los Angeles Kings|LA Kings
Wild|Minnesota Wild
Canadiens|Habs|Montreal Canadiens
Predators|Preds|Nashville Predators
Devils|New Jersey Devils
Islanders|Isles|New York Islanders
Rangers|New York Rangers
Senators|Sens|Ottawa Senators
Flyers|Philadelphia Flyers
Penguins|Pens|Pittsburgh Penguins
Sharks|San Jose Sharks
Kraken|Seattle Kraken
Blues|St. Louis Blues|St Louis Blues
Lightning|Bolts|Tampa Bay Lightning
Maple Leafs|Leafs|Toronto Maple Leafs
Mammoth|Utah Mammoth
Canucks|Vancouver Canucks
Golden Knights|Knights|Vegas Golden Knights
Capitals|Caps|Washington Capitals
Jets|Winnipeg Jets`, {
    1: ['Maple Leafs', 'Bruins', 'Rangers', 'Blackhawks', 'Red Wings', 'Canadiens', 'Penguins'],
    2: ['Oilers', 'Flyers', 'Kings', 'Lightning', 'Capitals', 'Golden Knights', 'Avalanche', 'Canucks', 'Islanders', 'Devils', 'Sharks', 'Stars'],
    4: ['Blue Jackets', 'Kraken', 'Predators', 'Wild', 'Sabres', 'Hurricanes', 'Mammoth'],
  }, 3);

  // Last names of US presidents. Adams, Harrison, Johnson, Roosevelt and Bush
  // each appear once because the answer is the name.
  const PRESIDENTS = parse(`
Washington
Adams
Jefferson
Madison
Monroe
Jackson
Van Buren|Vanburen
Harrison
Tyler
Polk
Taylor
Fillmore
Pierce
Buchanan
Lincoln
Johnson
Grant
Hayes
Garfield
Arthur
Cleveland
McKinley|Mckinley
Roosevelt
Taft
Wilson
Harding
Coolidge
Hoover
Truman
Eisenhower
Kennedy
Nixon
Ford
Carter
Reagan
Bush
Clinton
Obama
Trump
Biden`, {
    1: ['Washington', 'Lincoln', 'Obama', 'Trump', 'Biden', 'Kennedy', 'Roosevelt', 'Jefferson', 'Bush', 'Clinton', 'Reagan'],
    2: ['Nixon', 'Carter', 'Adams', 'Truman', 'Eisenhower', 'Jackson', 'Madison', 'Ford', 'Johnson', 'Grant'],
    4: ['Polk', 'Tyler', 'Taylor', 'Fillmore', 'Pierce', 'Buchanan', 'Hayes', 'Garfield', 'Arthur', 'Harding', 'Van Buren', 'Harrison'],
  }, 3);

  // ---- groups inside the lists above ----
  // Countries by continent. Countries that span two continents are in both.
  const CONTINENT = {
    africa: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of the Congo', "Côte d'Ivoire", 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Príncipe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
    europe: ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Italy', 'Kazakhstan', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom'],
    asia: ['Afghanistan', 'Armenia', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'Cyprus', 'Egypt', 'Georgia', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'North Korea', 'Oman', 'Pakistan', 'Philippines', 'Qatar', 'Russia', 'Saudi Arabia', 'Singapore', 'South Korea', 'Sri Lanka', 'Syria', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'],
    northAmerica: ['Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'United States'],
    southAmerica: ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'],
    oceania: ['Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu'],
  };
  // US Census Bureau regions.
  const REGION = {
    northeast: ['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont', 'New Jersey', 'New York', 'Pennsylvania'],
    midwest: ['Illinois', 'Indiana', 'Michigan', 'Ohio', 'Wisconsin', 'Iowa', 'Kansas', 'Minnesota', 'Missouri', 'Nebraska', 'North Dakota', 'South Dakota'],
    south: ['Delaware', 'Florida', 'Georgia', 'Maryland', 'North Carolina', 'South Carolina', 'Virginia', 'West Virginia', 'Alabama', 'Kentucky', 'Mississippi', 'Tennessee', 'Arkansas', 'Louisiana', 'Oklahoma', 'Texas'],
    west: ['Arizona', 'Colorado', 'Idaho', 'Montana', 'Nevada', 'New Mexico', 'Utah', 'Wyoming', 'Alaska', 'California', 'Hawaii', 'Oregon', 'Washington'],
  };
  const STATE_LISTS = {
    canada: ['Alaska', 'Washington', 'Idaho', 'Montana', 'North Dakota', 'Minnesota', 'Michigan', 'Ohio', 'Pennsylvania', 'New York', 'Vermont', 'New Hampshire', 'Maine'],
    mississippi: ['Minnesota', 'Wisconsin', 'Iowa', 'Illinois', 'Missouri', 'Kentucky', 'Tennessee', 'Arkansas', 'Mississippi', 'Louisiana'],
    colonies: ['Delaware', 'Pennsylvania', 'New Jersey', 'Georgia', 'Connecticut', 'Massachusetts', 'Maryland', 'South Carolina', 'New Hampshire', 'Virginia', 'New York', 'North Carolina', 'Rhode Island'],
    atlantic: ['Maine', 'New Hampshire', 'Massachusetts', 'Rhode Island', 'Connecticut', 'New York', 'New Jersey', 'Delaware', 'Maryland', 'Virginia', 'North Carolina', 'South Carolina', 'Georgia', 'Florida'],
    greatLakes: ['Minnesota', 'Wisconsin', 'Illinois', 'Indiana', 'Michigan', 'Ohio', 'Pennsylvania', 'New York'],
  };
  // Element symbols in atomic number order, matching ELEMENTS.
  const SYMBOLS = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
  ELEMENTS.forEach((it, i) => { it.z = i + 1; it.symbol = SYMBOLS[i]; });
  const ELEMENT_LISTS = {
    noble: ['Helium', 'Neon', 'Argon', 'Krypton', 'Xenon', 'Radon', 'Oganesson'],
    halogens: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine', 'Astatine', 'Tennessine'],
    alkali: ['Lithium', 'Sodium', 'Potassium', 'Rubidium', 'Cesium', 'Francium'],
  };
  // Presidents by party. A surname shared by presidents of both parties
  // (Roosevelt) is in both; Harrison counts through Benjamin Harrison.
  const PARTY = {
    democrat: ['Jackson', 'Van Buren', 'Polk', 'Pierce', 'Buchanan', 'Cleveland', 'Wilson', 'Roosevelt', 'Truman', 'Kennedy', 'Johnson', 'Carter', 'Clinton', 'Obama', 'Biden'],
    republican: ['Lincoln', 'Grant', 'Hayes', 'Garfield', 'Arthur', 'Harrison', 'McKinley', 'Roosevelt', 'Taft', 'Harding', 'Coolidge', 'Hoover', 'Eisenhower', 'Nixon', 'Ford', 'Reagan', 'Bush', 'Trump'],
  };
  const PRES_LISTS = {
    since1950: ['Truman', 'Eisenhower', 'Kennedy', 'Johnson', 'Nixon', 'Ford', 'Carter', 'Reagan', 'Bush', 'Clinton', 'Obama', 'Trump', 'Biden'],
    the1800s: ['Adams', 'Jefferson', 'Madison', 'Monroe', 'Jackson', 'Van Buren', 'Harrison', 'Tyler', 'Polk', 'Taylor', 'Fillmore', 'Pierce', 'Buchanan', 'Lincoln', 'Johnson', 'Grant', 'Hayes', 'Garfield', 'Arthur', 'Cleveland', 'McKinley'],
  };
  // Team nicknames by where the team plays.
  const TEAM_PLACES = {
    california: ['Warriors', 'Lakers', 'Clippers', 'Kings', '49ers', 'Rams', 'Chargers', 'Dodgers', 'Angels', 'Padres', 'Giants', 'Athletics', 'Ducks', 'Sharks'],
    texas: ['Mavericks', 'Rockets', 'Spurs', 'Cowboys', 'Texans', 'Rangers', 'Astros', 'Stars'],
    florida: ['Heat', 'Magic', 'Dolphins', 'Jaguars', 'Buccaneers', 'Marlins', 'Rays', 'Panthers', 'Lightning'],
    newYork: ['Knicks', 'Nets', 'Giants', 'Jets', 'Bills', 'Yankees', 'Mets', 'Rangers', 'Islanders', 'Sabres'],
    canada: ['Raptors', 'Blue Jays', 'Maple Leafs', 'Canadiens', 'Senators', 'Jets', 'Oilers', 'Flames', 'Canucks'],
    pennsylvania: ['76ers', 'Eagles', 'Steelers', 'Phillies', 'Pirates', 'Flyers', 'Penguins'],
  };

  // ---- more lists ----
  // World capitals as each country names them. Countries with more than one
  // capital (Bolivia, South Africa) list each one.
  const CAP_PAIRS = [
    ['Kabul', 'Afghanistan'], ['Tirana', 'Albania'], ['Algiers', 'Algeria'], ['Andorra la Vella', 'Andorra'], ['Luanda', 'Angola'],
    ["Saint John's|St. John's|St Johns", 'Antigua and Barbuda'], ['Buenos Aires', 'Argentina'], ['Yerevan', 'Armenia'], ['Canberra', 'Australia'], ['Vienna|Wien', 'Austria'],
    ['Baku', 'Azerbaijan'], ['Nassau', 'Bahamas'], ['Manama', 'Bahrain'], ['Dhaka|Dacca', 'Bangladesh'], ['Bridgetown', 'Barbados'],
    ['Minsk', 'Belarus'], ['Brussels|Bruxelles', 'Belgium'], ['Belmopan', 'Belize'], ['Porto-Novo|Porto Novo', 'Benin'], ['Thimphu', 'Bhutan'],
    ['Sucre', 'Bolivia'], ['La Paz', 'Bolivia'], ['Sarajevo', 'Bosnia and Herzegovina'], ['Gaborone', 'Botswana'], ['Brasília|Brasilia', 'Brazil'],
    ['Bandar Seri Begawan', 'Brunei'], ['Sofia', 'Bulgaria'], ['Ouagadougou', 'Burkina Faso'], ['Gitega', 'Burundi'], ['Praia', 'Cabo Verde'],
    ['Phnom Penh', 'Cambodia'], ['Yaoundé|Yaounde', 'Cameroon'], ['Ottawa', 'Canada'], ['Bangui', 'Central African Republic'], ["N'Djamena|Ndjamena", 'Chad'],
    ['Santiago', 'Chile'], ['Beijing|Peking', 'China'], ['Bogotá|Bogota', 'Colombia'], ['Moroni', 'Comoros'], ['Brazzaville', 'Congo'],
    ['Kinshasa', 'Democratic Republic of the Congo'], ['San José|San Jose', 'Costa Rica'], ['Yamoussoukro', "Côte d'Ivoire"], ['Zagreb', 'Croatia'], ['Havana|La Habana', 'Cuba'],
    ['Nicosia', 'Cyprus'], ['Prague|Praha', 'Czechia'], ['Copenhagen', 'Denmark'], ['Djibouti|Djibouti City', 'Djibouti'], ['Roseau', 'Dominica'],
    ['Santo Domingo', 'Dominican Republic'], ['Quito', 'Ecuador'], ['Cairo', 'Egypt'], ['San Salvador', 'El Salvador'], ['Malabo', 'Equatorial Guinea'],
    ['Asmara', 'Eritrea'], ['Tallinn', 'Estonia'], ['Mbabane', 'Eswatini'], ['Lobamba', 'Eswatini'], ['Addis Ababa', 'Ethiopia'],
    ['Suva', 'Fiji'], ['Helsinki', 'Finland'], ['Paris', 'France'], ['Libreville', 'Gabon'], ['Banjul', 'Gambia'],
    ['Tbilisi', 'Georgia'], ['Berlin', 'Germany'], ['Accra', 'Ghana'], ['Athens', 'Greece'], ["St. George's|Saint George's|St Georges", 'Grenada'],
    ['Guatemala City', 'Guatemala'], ['Conakry', 'Guinea'], ['Bissau', 'Guinea-Bissau'], ['Georgetown', 'Guyana'], ['Port-au-Prince|Port au Prince', 'Haiti'],
    ['Tegucigalpa', 'Honduras'], ['Budapest', 'Hungary'], ['Reykjavík|Reykjavik', 'Iceland'], ['New Delhi|Delhi', 'India'], ['Jakarta', 'Indonesia'],
    ['Tehran|Teheran', 'Iran'], ['Baghdad', 'Iraq'], ['Dublin', 'Ireland'], ['Jerusalem', 'Israel'], ['Rome|Roma', 'Italy'],
    ['Kingston', 'Jamaica'], ['Tokyo', 'Japan'], ['Amman', 'Jordan'], ['Astana', 'Kazakhstan'], ['Nairobi', 'Kenya'],
    ['South Tarawa|Tarawa', 'Kiribati'], ['Kuwait City', 'Kuwait'], ['Bishkek', 'Kyrgyzstan'], ['Vientiane', 'Laos'], ['Riga', 'Latvia'],
    ['Beirut', 'Lebanon'], ['Maseru', 'Lesotho'], ['Monrovia', 'Liberia'], ['Tripoli', 'Libya'], ['Vaduz', 'Liechtenstein'],
    ['Vilnius', 'Lithuania'], ['Luxembourg|Luxembourg City', 'Luxembourg'], ['Antananarivo', 'Madagascar'], ['Lilongwe', 'Malawi'], ['Kuala Lumpur', 'Malaysia'],
    ['Putrajaya', 'Malaysia'], ['Malé|Male', 'Maldives'], ['Bamako', 'Mali'], ['Valletta', 'Malta'], ['Majuro', 'Marshall Islands'],
    ['Nouakchott', 'Mauritania'], ['Port Louis', 'Mauritius'], ['Mexico City|Ciudad de Mexico', 'Mexico'], ['Palikir', 'Micronesia'], ['Chișinău|Chisinau', 'Moldova'],
    ['Monaco', 'Monaco'], ['Ulaanbaatar|Ulan Bator', 'Mongolia'], ['Podgorica', 'Montenegro'], ['Rabat', 'Morocco'], ['Maputo', 'Mozambique'],
    ['Naypyidaw|Nay Pyi Taw', 'Myanmar'], ['Windhoek', 'Namibia'], ['Yaren', 'Nauru'], ['Kathmandu', 'Nepal'], ['Amsterdam', 'Netherlands'],
    ['Wellington', 'New Zealand'], ['Managua', 'Nicaragua'], ['Niamey', 'Niger'], ['Abuja', 'Nigeria'], ['Pyongyang', 'North Korea'],
    ['Skopje', 'North Macedonia'], ['Oslo', 'Norway'], ['Muscat', 'Oman'], ['Islamabad', 'Pakistan'], ['Ngerulmud', 'Palau'],
    ['Panama City', 'Panama'], ['Port Moresby', 'Papua New Guinea'], ['Asunción|Asuncion', 'Paraguay'], ['Lima', 'Peru'], ['Manila', 'Philippines'],
    ['Warsaw', 'Poland'], ['Lisbon|Lisboa', 'Portugal'], ['Doha', 'Qatar'], ['Bucharest', 'Romania'], ['Moscow', 'Russia'],
    ['Kigali', 'Rwanda'], ['Basseterre', 'Saint Kitts and Nevis'], ['Castries', 'Saint Lucia'], ['Kingstown', 'Saint Vincent and the Grenadines'], ['Apia', 'Samoa'],
    ['San Marino', 'San Marino'], ['São Tomé|Sao Tome', 'São Tomé and Príncipe'], ['Riyadh', 'Saudi Arabia'], ['Dakar', 'Senegal'], ['Belgrade', 'Serbia'],
    ['Victoria', 'Seychelles'], ['Freetown', 'Sierra Leone'], ['Singapore', 'Singapore'], ['Bratislava', 'Slovakia'], ['Ljubljana', 'Slovenia'],
    ['Honiara', 'Solomon Islands'], ['Mogadishu', 'Somalia'], ['Pretoria', 'South Africa'], ['Cape Town', 'South Africa'], ['Bloemfontein', 'South Africa'],
    ['Seoul', 'South Korea'], ['Juba', 'South Sudan'], ['Madrid', 'Spain'], ['Sri Jayawardenepura Kotte|Kotte', 'Sri Lanka'], ['Khartoum', 'Sudan'],
    ['Paramaribo', 'Suriname'], ['Stockholm', 'Sweden'], ['Bern|Berne', 'Switzerland'], ['Damascus', 'Syria'], ['Dushanbe', 'Tajikistan'],
    ['Dodoma', 'Tanzania'], ['Bangkok', 'Thailand'], ['Dili', 'Timor-Leste'], ['Lomé|Lome', 'Togo'], ["Nuku'alofa|Nukualofa", 'Tonga'],
    ['Port of Spain', 'Trinidad and Tobago'], ['Tunis', 'Tunisia'], ['Ankara', 'Turkey'], ['Ashgabat', 'Turkmenistan'], ['Funafuti', 'Tuvalu'],
    ['Kampala', 'Uganda'], ['Kyiv|Kiev', 'Ukraine'], ['Abu Dhabi', 'United Arab Emirates'], ['London', 'United Kingdom'], ['Washington, D.C.|Washington DC|DC|Washington', 'United States'],
    ['Montevideo', 'Uruguay'], ['Tashkent', 'Uzbekistan'], ['Port Vila', 'Vanuatu'], ['Caracas', 'Venezuela'], ['Hanoi', 'Vietnam'], ["Sana'a|Sanaa", 'Yemen'],
    ['Lusaka', 'Zambia'], ['Harare', 'Zimbabwe'],
  ];
  const CAPITALS = parse(CAP_PAIRS.map((p) => p[0]).join('\n'), {
    1: ['London', 'Paris', 'Tokyo', 'Rome', 'Berlin', 'Madrid', 'Beijing', 'Moscow', 'Washington, D.C.', 'Ottawa', 'Mexico City', 'Cairo', 'Athens', 'Dublin'],
    2: ['Amsterdam', 'Lisbon', 'Vienna', 'Brussels', 'Stockholm', 'Oslo', 'Copenhagen', 'Helsinki', 'Warsaw', 'Prague', 'Budapest', 'Bern', 'Canberra', 'Wellington', 'New Delhi', 'Seoul', 'Bangkok', 'Manila', 'Jakarta', 'Buenos Aires', 'Lima', 'Santiago', 'Bogotá', 'Havana', 'Kyiv', 'Jerusalem', 'Tehran', 'Baghdad', 'Nairobi', 'Riyadh', 'Islamabad', 'Kabul', 'Singapore', 'Hanoi', 'Caracas', 'Brasília', 'Reykjavík', 'Kingston', 'Cape Town'],
    5: ['Ngerulmud', 'Palikir', 'Yaren', 'Funafuti', 'Majuro', 'South Tarawa', 'Honiara', 'Basseterre', 'Kingstown', 'Castries', 'Roseau', 'Sri Jayawardenepura Kotte', 'Gitega', 'Lobamba', 'Moroni', 'Malabo', 'Naypyidaw', 'Putrajaya'],
  }, 3, Object.fromEntries(CAP_PAIRS.map((p) => [p[0].split('|')[0], { country: p[1] }])));

  const STATE_CAPITALS = parse(`
Montgomery
Juneau
Phoenix
Little Rock
Sacramento
Denver
Hartford
Dover
Tallahassee
Atlanta
Honolulu
Boise
Springfield
Indianapolis
Des Moines
Topeka
Frankfort
Baton Rouge
Augusta
Annapolis
Boston
Lansing
Saint Paul|St. Paul|St Paul
Jackson
Jefferson City
Helena
Lincoln
Carson City
Concord
Trenton
Santa Fe
Albany
Raleigh
Bismarck
Columbus
Oklahoma City
Salem
Harrisburg
Providence
Columbia
Pierre
Nashville
Austin
Salt Lake City
Montpelier
Richmond
Olympia
Charleston
Madison
Cheyenne`, {
    1: ['Boston', 'Atlanta', 'Denver', 'Phoenix', 'Austin', 'Nashville', 'Honolulu', 'Sacramento', 'Indianapolis', 'Salt Lake City'],
    2: ['Albany', 'Columbus', 'Oklahoma City', 'Richmond', 'Raleigh', 'Saint Paul', 'Madison', 'Little Rock', 'Baton Rouge', 'Santa Fe', 'Tallahassee', 'Providence', 'Hartford', 'Des Moines', 'Boise', 'Springfield', 'Lansing'],
    4: ['Pierre', 'Montpelier', 'Augusta', 'Dover', 'Frankfort', 'Jefferson City', 'Olympia', 'Bismarck', 'Juneau', 'Helena', 'Cheyenne', 'Carson City', 'Concord', 'Topeka'],
  }, 3);

  const CONSTELLATIONS = parse(`
Andromeda
Antlia
Apus
Aquarius
Aquila
Ara
Aries
Auriga
Boötes|Bootes
Caelum
Camelopardalis
Cancer
Canes Venatici
Canis Major
Canis Minor
Capricornus|Capricorn
Carina
Cassiopeia
Centaurus
Cepheus
Cetus
Chamaeleon
Circinus
Columba
Coma Berenices
Corona Australis
Corona Borealis
Corvus
Crater
Crux|Southern Cross
Cygnus
Delphinus
Dorado
Draco
Equuleus
Eridanus
Fornax
Gemini
Grus
Hercules
Horologium
Hydra
Hydrus
Indus
Lacerta
Leo
Leo Minor
Lepus
Libra
Lupus
Lynx
Lyra
Mensa
Microscopium
Monoceros
Musca
Norma
Octans
Ophiuchus
Orion
Pavo
Pegasus
Perseus
Phoenix
Pictor
Pisces
Piscis Austrinus
Puppis
Pyxis
Reticulum
Sagitta
Sagittarius
Scorpius|Scorpio
Sculptor
Scutum
Serpens
Sextans
Taurus
Telescopium
Triangulum
Triangulum Australe
Tucana
Ursa Major|Great Bear
Ursa Minor|Little Bear
Vela
Virgo
Volans
Vulpecula`, {
    1: ['Orion', 'Ursa Major', 'Ursa Minor', 'Cassiopeia'],
    2: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces', 'Andromeda', 'Pegasus', 'Draco', 'Hercules', 'Perseus', 'Cygnus', 'Phoenix', 'Hydra', 'Canis Major', 'Crux'],
    4: ['Antlia', 'Apus', 'Caelum', 'Camelopardalis', 'Chamaeleon', 'Circinus', 'Crater', 'Dorado', 'Equuleus', 'Fornax', 'Grus', 'Horologium', 'Hydrus', 'Indus', 'Lacerta', 'Leo Minor', 'Mensa', 'Microscopium', 'Monoceros', 'Musca', 'Norma', 'Octans', 'Pictor', 'Piscis Austrinus', 'Puppis', 'Pyxis', 'Reticulum', 'Sagitta', 'Sculptor', 'Scutum', 'Sextans', 'Telescopium', 'Triangulum Australe', 'Tucana', 'Vela', 'Volans', 'Vulpecula', 'Ara', 'Carina', 'Coma Berenices', 'Canes Venatici', 'Corona Australis', 'Pavo'],
  }, 3);
  const ZODIAC = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpius', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'];

  const GREEK = parse(`
Alpha
Beta
Gamma
Delta
Epsilon
Zeta
Eta
Theta
Iota
Kappa
Lambda
Mu
Nu
Xi
Omicron
Pi
Rho
Sigma
Tau
Upsilon
Phi
Chi
Psi
Omega`, {
    1: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Pi'],
    2: ['Sigma', 'Theta', 'Lambda', 'Epsilon', 'Kappa', 'Zeta', 'Phi', 'Omicron'],
    4: ['Nu', 'Xi'],
  }, 3);

  const NATO = parse(`
Alfa|Alpha
Bravo
Charlie
Delta
Echo
Foxtrot
Golf
Hotel
India
Juliett|Juliet
Kilo
Lima
Mike
November
Oscar
Papa
Quebec
Romeo
Sierra
Tango
Uniform
Victor
Whiskey|Whisky
X-ray|Xray
Yankee
Zulu`, {
    1: ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Tango', 'Zulu', 'Victor', 'Romeo', 'Oscar'],
    3: ['Uniform', 'Kilo', 'Quebec', 'Juliett', 'Papa', 'Lima', 'Hotel'],
  }, 2);

  // Books of the Bible (the 66 book Protestant canon). Numbered books count
  // once: Kings covers 1 Kings and 2 Kings, John covers the gospel and the
  // three letters.
  const BIBLE = parse(`
Genesis
Exodus
Leviticus
Numbers
Deuteronomy
Joshua
Judges
Ruth
Samuel|1 Samuel|2 Samuel|First Samuel|Second Samuel
Kings|1 Kings|2 Kings|First Kings|Second Kings
Chronicles|1 Chronicles|2 Chronicles|First Chronicles|Second Chronicles
Ezra
Nehemiah
Esther
Job
Psalms|Psalm
Proverbs
Ecclesiastes
Song of Solomon|Song of Songs
Isaiah
Jeremiah
Lamentations
Ezekiel
Daniel
Hosea
Joel
Amos
Obadiah
Jonah
Micah
Nahum
Habakkuk
Zephaniah
Haggai
Zechariah
Malachi
Matthew
Mark
Luke
John|1 John|2 John|3 John|First John
Acts|Acts of the Apostles
Romans
Corinthians|1 Corinthians|2 Corinthians|First Corinthians|Second Corinthians
Galatians
Ephesians
Philippians
Colossians
Thessalonians|1 Thessalonians|2 Thessalonians
Timothy|1 Timothy|2 Timothy
Titus
Philemon
Hebrews
James
Peter|1 Peter|2 Peter|First Peter|Second Peter
Jude
Revelation|Revelations`, {
    1: ['Genesis', 'Exodus', 'Psalms', 'Matthew', 'Mark', 'Luke', 'John', 'Revelation'],
    2: ['Job', 'Proverbs', 'Isaiah', 'Daniel', 'Jonah', 'Ruth', 'Acts', 'Romans', 'Corinthians', 'Kings', 'Samuel', 'Numbers', 'Leviticus', 'Deuteronomy', 'Esther', 'Ecclesiastes', 'Song of Solomon', 'Hebrews', 'James', 'Peter', 'Timothy', 'Joshua', 'Judges'],
    4: ['Obadiah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Philemon', 'Jude', 'Titus', 'Micah', 'Joel', 'Amos', 'Malachi', 'Zechariah', 'Hosea'],
  }, 3);
  const NEW_TESTAMENT = ['Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', 'Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', 'Thessalonians', 'Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', 'Peter', 'Jude', 'Revelation'];

  const UNIVERSES = {
    countries: { id: 'countries', items: COUNTRIES, noun: 'a UN member state', short: 'UN member state' },
    states: { id: 'states', items: US_STATES, noun: 'a US state', short: 'US state' },
    mexico: { id: 'mexico', items: MX_STATES, noun: 'a Mexican state (Mexico City counts)', short: 'Mexican state' },
    elements: { id: 'elements', items: ELEMENTS, noun: 'a chemical element', short: 'element' },
    nba: { id: 'nba', items: NBA, noun: 'an NBA team, by nickname', short: 'NBA team' },
    nfl: { id: 'nfl', items: NFL, noun: 'an NFL team, by nickname', short: 'NFL team' },
    mlb: { id: 'mlb', items: MLB, noun: 'an MLB team, by nickname', short: 'MLB team' },
    nhl: { id: 'nhl', items: NHL, noun: 'an NHL team, by nickname', short: 'NHL team' },
    presidents: { id: 'presidents', items: PRESIDENTS, noun: 'the last name of a US president', short: 'president' },
    capitals: { id: 'capitals', items: CAPITALS, noun: 'a national capital', short: 'capital' },
    statecaps: { id: 'statecaps', items: STATE_CAPITALS, noun: 'a US state capital', short: 'state capital' },
    constellations: { id: 'constellations', items: CONSTELLATIONS, noun: 'one of the 88 constellations', short: 'constellation' },
    greek: { id: 'greek', items: GREEK, noun: 'a letter of the Greek alphabet', short: 'Greek letter' },
    nato: { id: 'nato', items: NATO, noun: 'a word in the NATO phonetic alphabet', short: 'NATO alphabet word' },
    bible: { id: 'bible', items: BIBLE, noun: 'a book of the Bible', short: 'book of the Bible' },
  };

  const R = typeof Rarity !== 'undefined' ? Rarity : require('./rarity.js');
  for (const u of Object.values(UNIVERSES)) for (const it of u.items) it.fam = (R[u.id] || {})[it.name];

  return { UNIVERSES, LANDLOCKED, MX_PACIFIC, CONTINENT, REGION, STATE_LISTS, ELEMENT_LISTS, PARTY, PRES_LISTS, TEAM_PLACES, ZODIAC, NEW_TESTAMENT };
})();
if (typeof module !== 'undefined') module.exports = Data;
