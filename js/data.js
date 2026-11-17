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

  // ---- where teams play ----
  // The place in each team's name, so questions can ask for a city or state
  // in place of a nickname. The Athletics have no home city in their name.
  const TEAM_CITY = {
    nfl: { Cardinals: 'Arizona', Falcons: 'Atlanta', Ravens: 'Baltimore', Bills: 'Buffalo', Panthers: 'Carolina', Bears: 'Chicago', Bengals: 'Cincinnati', Browns: 'Cleveland', Cowboys: 'Dallas', Broncos: 'Denver', Lions: 'Detroit', Packers: 'Green Bay', Texans: 'Houston', Colts: 'Indianapolis', Jaguars: 'Jacksonville', Chiefs: 'Kansas City', Raiders: 'Las Vegas', Chargers: 'Los Angeles', Rams: 'Los Angeles', Dolphins: 'Miami', Vikings: 'Minnesota', Patriots: 'New England', Saints: 'New Orleans', Giants: 'New York', Jets: 'New York', Eagles: 'Philadelphia', Steelers: 'Pittsburgh', '49ers': 'San Francisco', Seahawks: 'Seattle', Buccaneers: 'Tampa Bay', Titans: 'Tennessee', Commanders: 'Washington' },
    nba: { Hawks: 'Atlanta', Celtics: 'Boston', Nets: 'Brooklyn', Hornets: 'Charlotte', Bulls: 'Chicago', Cavaliers: 'Cleveland', Mavericks: 'Dallas', Nuggets: 'Denver', Pistons: 'Detroit', Warriors: 'Golden State', Rockets: 'Houston', Pacers: 'Indiana', Clippers: 'Los Angeles', Lakers: 'Los Angeles', Grizzlies: 'Memphis', Heat: 'Miami', Bucks: 'Milwaukee', Timberwolves: 'Minnesota', Pelicans: 'New Orleans', Knicks: 'New York', Thunder: 'Oklahoma City', Magic: 'Orlando', '76ers': 'Philadelphia', Suns: 'Phoenix', 'Trail Blazers': 'Portland', Kings: 'Sacramento', Spurs: 'San Antonio', Raptors: 'Toronto', Jazz: 'Utah', Wizards: 'Washington' },
    mlb: { Diamondbacks: 'Arizona', Braves: 'Atlanta', Orioles: 'Baltimore', 'Red Sox': 'Boston', Cubs: 'Chicago', 'White Sox': 'Chicago', Reds: 'Cincinnati', Guardians: 'Cleveland', Rockies: 'Colorado', Tigers: 'Detroit', Astros: 'Houston', Royals: 'Kansas City', Angels: 'Los Angeles', Dodgers: 'Los Angeles', Marlins: 'Miami', Brewers: 'Milwaukee', Twins: 'Minnesota', Mets: 'New York', Yankees: 'New York', Phillies: 'Philadelphia', Pirates: 'Pittsburgh', Padres: 'San Diego', Giants: 'San Francisco', Mariners: 'Seattle', Cardinals: 'St. Louis', Rays: 'Tampa Bay', Rangers: 'Texas', 'Blue Jays': 'Toronto', Nationals: 'Washington' },
    nhl: { Ducks: 'Anaheim', Bruins: 'Boston', Sabres: 'Buffalo', Flames: 'Calgary', Hurricanes: 'Carolina', Blackhawks: 'Chicago', Avalanche: 'Colorado', 'Blue Jackets': 'Columbus', Stars: 'Dallas', 'Red Wings': 'Detroit', Oilers: 'Edmonton', Panthers: 'Florida', Kings: 'Los Angeles', Wild: 'Minnesota', Canadiens: 'Montreal', Predators: 'Nashville', Devils: 'New Jersey', Islanders: 'New York', Rangers: 'New York', Senators: 'Ottawa', Flyers: 'Philadelphia', Penguins: 'Pittsburgh', Sharks: 'San Jose', Kraken: 'Seattle', Blues: 'St. Louis', Lightning: 'Tampa Bay', 'Maple Leafs': 'Toronto', Mammoth: 'Utah', Canucks: 'Vancouver', 'Golden Knights': 'Vegas', Capitals: 'Washington', Jets: 'Winnipeg' },
  };
  // Other names people use for a team's place.
  const PLACE_ALIASES = {
    Arizona: ['Phoenix', 'Glendale'], Carolina: ['Charlotte', 'Raleigh'], Minnesota: ['Minneapolis', 'Saint Paul', 'St. Paul'], 'New England': ['Boston', 'Foxborough'],
    Tennessee: ['Nashville'], 'Golden State': ['San Francisco', 'Oakland', 'Bay Area'], Indiana: ['Indianapolis'], Utah: ['Salt Lake City', 'Salt Lake'], Colorado: ['Denver'],
    Texas: ['Arlington', 'Dallas'], 'Tampa Bay': ['Tampa', 'St. Petersburg'], Washington: ['Washington DC', 'DC'], 'Las Vegas': ['Vegas'], Vegas: ['Las Vegas'],
    'New Jersey': ['Newark'], 'Los Angeles': ['LA'], 'New York': ['NYC', 'New York City'], 'St. Louis': ['Saint Louis'], 'Oklahoma City': ['OKC'], Montreal: ['Montréal'],
  };
  const LEAGUE_ITEMS = { nfl: NFL, nba: NBA, mlb: MLB, nhl: NHL };
  const CITY_TIERS = { 1: ['New York', 'Los Angeles', 'Chicago', 'Boston', 'Dallas', 'Miami', 'Philadelphia', 'Toronto'], 2: ['Atlanta', 'Houston', 'Detroit', 'Denver', 'Seattle', 'San Francisco', 'Washington', 'Pittsburgh', 'Green Bay', 'Las Vegas', 'New Orleans', 'Cleveland', 'Montreal', 'Phoenix'], 4: ['Columbus', 'Winnipeg', 'Anaheim', 'Calgary', 'Edmonton', 'Ottawa', 'San Jose', 'Utah', 'Vegas', 'Florida', 'Carolina', 'New England', 'Tennessee', 'Golden State', 'Indiana', 'Arizona', 'Colorado', 'Texas', 'Jacksonville'] };
  const CITY_UNIS = {};
  for (const [lg, map] of Object.entries(TEAM_CITY)) {
    const places = new Map();
    for (const it of LEAGUE_ITEMS[lg]) {
      const place = map[it.name]; if (!place) continue;
      // nickname questions also take the full team name ("Dallas Cowboys")
      for (const n of [place, ...(PLACE_ALIASES[place] || [])]) if (!it.aliases.includes(`${n} ${it.name}`)) it.aliases.push(`${n} ${it.name}`);
      if (!places.has(place)) places.set(place, []);
      places.get(place).push(it.name);
    }
    const names = new Set(places.keys());
    const lines = [...places.entries()].map(([place, nicks]) => [place, ...(PLACE_ALIASES[place] || []).filter((a) => !names.has(a)), ...nicks.map((nk) => `${place} ${nk}`)].join('|'));
    CITY_UNIS[lg] = parse(lines.join('\n'), CITY_TIERS, 3);
  }

  // ---- soccer around the world ----
  const WORLD_CUP = parse(`
Brazil
Germany|West Germany
Italy
Argentina
France
Uruguay
Spain
England`, { 1: ['Brazil', 'Germany', 'Italy', 'Argentina', 'France'], 2: ['Spain', 'England'], 4: ['Uruguay'] }, 3);
  const UCL_WINNERS = parse(`
Real Madrid
AC Milan|Milan
Bayern Munich|Bayern|Bayern München
Liverpool
Barcelona|Barça|FC Barcelona
Ajax|Ajax Amsterdam
Inter Milan|Inter|Internazionale
Manchester United|Man United|Man Utd
Juventus|Juve
Benfica
Chelsea
Nottingham Forest|Forest
Porto|FC Porto
Borussia Dortmund|Dortmund
Celtic
Hamburg|Hamburger SV
Steaua Bucharest|Steaua|FCSB
Marseille|Olympique de Marseille
Feyenoord
Aston Villa|Villa
PSV Eindhoven|PSV
Red Star Belgrade|Red Star
Manchester City|Man City
Paris Saint-Germain|PSG|Paris SG`, { 1: ['Real Madrid', 'Barcelona', 'Manchester United', 'Liverpool', 'Bayern Munich'], 2: ['AC Milan', 'Chelsea', 'Juventus', 'Manchester City', 'Paris Saint-Germain', 'Inter Milan', 'Ajax'], 4: ['Steaua Bucharest', 'Red Star Belgrade', 'Feyenoord', 'Hamburg', 'Celtic', 'Nottingham Forest', 'Aston Villa', 'PSV Eindhoven', 'Benfica', 'Marseille'] }, 3);
  // Premier League clubs in the 2026–27 season.
  const PREMIER = parse(`
Arsenal
Aston Villa|Villa
Bournemouth|AFC Bournemouth
Brentford
Brighton|Brighton and Hove Albion|Brighton & Hove Albion
Chelsea
Coventry City|Coventry
Crystal Palace|Palace
Everton
Fulham
Hull City|Hull
Ipswich Town|Ipswich
Leeds United|Leeds
Liverpool
Manchester City|Man City
Manchester United|Man United|Man Utd
Newcastle United|Newcastle
Nottingham Forest|Forest
Sunderland
Tottenham Hotspur|Tottenham|Spurs`, { 1: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United', 'Manchester City', 'Tottenham Hotspur'], 2: ['Newcastle United', 'Aston Villa', 'Everton', 'Leeds United'], 4: ['Brentford', 'Bournemouth', 'Coventry City', 'Hull City', 'Ipswich Town', 'Sunderland'] }, 3);
  // Cities that have hosted the Summer Olympics, through Paris 2024.
  const OLYMPIC_HOSTS = parse(`
Athens
Paris
St. Louis|Saint Louis
London
Stockholm
Antwerp
Amsterdam
Los Angeles|LA
Berlin
Helsinki
Melbourne
Rome
Tokyo
Mexico City
Munich
Montreal|Montréal
Moscow
Seoul
Barcelona
Atlanta
Sydney
Beijing
Rio de Janeiro|Rio`, { 1: ['London', 'Paris', 'Los Angeles', 'Beijing', 'Tokyo', 'Sydney', 'Athens', 'Rio de Janeiro', 'Atlanta', 'Barcelona'], 2: ['Moscow', 'Seoul', 'Montreal', 'Munich', 'Mexico City', 'Rome', 'Berlin'], 4: ['Antwerp', 'Stockholm', 'Helsinki', 'Melbourne', 'St. Louis', 'Amsterdam'] }, 3);

  // ---- movies and TV ----
  const BEST_PICTURE = parse(`
Wings
The Broadway Melody
All Quiet on the Western Front
Cimarron
Grand Hotel
Cavalcade
It Happened One Night
Mutiny on the Bounty
The Great Ziegfeld
The Life of Emile Zola
You Can't Take It with You
Gone with the Wind
Rebecca
How Green Was My Valley
Mrs. Miniver|Mrs Miniver
Casablanca
Going My Way
The Lost Weekend
The Best Years of Our Lives
Gentleman's Agreement
Hamlet
All the King's Men
All About Eve
An American in Paris
The Greatest Show on Earth
From Here to Eternity
On the Waterfront
Marty
Around the World in 80 Days|Around the World in Eighty Days
The Bridge on the River Kwai
Gigi
Ben-Hur|Ben Hur
The Apartment
West Side Story
Lawrence of Arabia
Tom Jones
My Fair Lady
The Sound of Music
A Man for All Seasons
In the Heat of the Night
Oliver!|Oliver
Midnight Cowboy
Patton
The French Connection
The Godfather
The Sting
The Godfather Part II|The Godfather Part 2|Godfather 2
One Flew Over the Cuckoo's Nest
Rocky
Annie Hall
The Deer Hunter
Kramer vs. Kramer|Kramer vs Kramer|Kramer versus Kramer
Ordinary People
Chariots of Fire
Gandhi
Terms of Endearment
Amadeus
Out of Africa
Platoon
The Last Emperor
Rain Man
Driving Miss Daisy
Dances with Wolves
The Silence of the Lambs
Unforgiven
Schindler's List
Forrest Gump
Braveheart
The English Patient
Titanic
Shakespeare in Love
American Beauty
Gladiator
A Beautiful Mind
Chicago
The Lord of the Rings: The Return of the King|The Return of the King|Return of the King
Million Dollar Baby
Crash
The Departed
No Country for Old Men
Slumdog Millionaire
The Hurt Locker
The King's Speech
The Artist
Argo
12 Years a Slave|Twelve Years a Slave
Birdman
Spotlight
Moonlight
The Shape of Water
Green Book
Parasite
Nomadland
CODA
Everything Everywhere All at Once
Oppenheimer
Anora
One Battle After Another`, {
    1: ['Titanic', 'The Godfather', 'Forrest Gump', 'Gladiator', 'Casablanca', 'Gone with the Wind', 'Rocky', 'The Sound of Music', "Schindler's List", 'Braveheart', 'The Lord of the Rings: The Return of the King', 'Oppenheimer'],
    2: ['The Silence of the Lambs', 'Parasite', 'The Departed', 'Slumdog Millionaire', 'Chicago', 'A Beautiful Mind', 'West Side Story', 'Ben-Hur', 'Rain Man', 'Dances with Wolves', 'American Beauty', 'The Godfather Part II', "One Flew Over the Cuckoo's Nest", 'Everything Everywhere All at Once', 'Argo', 'The Shape of Water', 'Green Book', "The King's Speech", 'Lawrence of Arabia', 'My Fair Lady', 'Unforgiven', 'Titanic', 'Moonlight', 'Shakespeare in Love', 'No Country for Old Men', 'The Hurt Locker', 'Million Dollar Baby', 'Anora', 'Spotlight'],
    4: ['Wings', 'The Broadway Melody', 'Cimarron', 'Grand Hotel', 'Cavalcade', 'The Great Ziegfeld', 'The Life of Emile Zola', 'You Can\'t Take It with You', 'How Green Was My Valley', 'Mrs. Miniver', 'Going My Way', 'The Lost Weekend', "Gentleman's Agreement", 'Hamlet', "All the King's Men", 'Marty', 'Gigi', 'Tom Jones', 'Oliver!', 'Ordinary People', 'Terms of Endearment', 'Out of Africa', 'The Last Emperor', 'Driving Miss Daisy', 'The English Patient', 'Crash', 'The Artist', 'Nomadland', 'CODA', 'Kramer vs. Kramer', 'Patton', 'Midnight Cowboy', 'The French Connection', 'The Sting', 'The Deer Hunter', 'Annie Hall', 'Chariots of Fire', 'Gandhi', 'Amadeus', 'Platoon', 'One Battle After Another', 'Birdman', '12 Years a Slave', 'The Apartment', 'A Man for All Seasons', 'In the Heat of the Night', 'Around the World in 80 Days', 'The Greatest Show on Earth', 'An American in Paris', 'Rebecca', 'It Happened One Night', 'Mutiny on the Bounty', 'All Quiet on the Western Front', 'The Best Years of Our Lives', 'From Here to Eternity', 'On the Waterfront', 'The Bridge on the River Kwai', 'All About Eve'],
  }, 3);
  // Winners from the 1990 ceremony on (the films of 1989 and later).
  const BEST_PICTURE_RECENT = BEST_PICTURE.slice(BEST_PICTURE.findIndex((it) => it.name === 'Driving Miss Daisy')).map((it) => it.name);
  const PIXAR = parse(`
Toy Story
A Bug's Life
Toy Story 2
Monsters, Inc.|Monsters Inc
Finding Nemo
The Incredibles|Incredibles
Cars
Ratatouille
WALL-E|Wall-E|Wall E
Up
Toy Story 3
Cars 2
Brave
Monsters University
Inside Out
The Good Dinosaur
Finding Dory
Cars 3
Coco
Incredibles 2
Toy Story 4
Onward
Soul
Luca
Turning Red
Lightyear
Elemental
Inside Out 2
Elio
Hoppers
Toy Story 5`, { 1: ['Toy Story', 'Finding Nemo', 'The Incredibles', 'Cars', 'Up', 'Monsters, Inc.', 'Inside Out', 'Coco'], 2: ['Ratatouille', 'WALL-E', 'Toy Story 2', 'Toy Story 3', 'Finding Dory', 'Brave', 'Incredibles 2', 'Toy Story 4', "A Bug's Life", 'Inside Out 2', 'Monsters University', 'Soul'], 4: ['Onward', 'Luca', 'Turning Red', 'Lightyear', 'Elemental', 'The Good Dinosaur', 'Elio', 'Hoppers', 'Cars 3'] }, 3);
  const BOND = parse(`
Dr. No|Doctor No|Dr No
From Russia with Love
Goldfinger
Thunderball
You Only Live Twice
On Her Majesty's Secret Service
Diamonds Are Forever
Live and Let Die
The Man with the Golden Gun
The Spy Who Loved Me
Moonraker
For Your Eyes Only
Octopussy
A View to a Kill
The Living Daylights
Licence to Kill|License to Kill
GoldenEye|Golden Eye
Tomorrow Never Dies
The World Is Not Enough
Die Another Day
Casino Royale
Quantum of Solace
Skyfall
Spectre
No Time to Die`, { 1: ['Goldfinger', 'Skyfall', 'Casino Royale', 'GoldenEye', 'Dr. No'], 2: ['Thunderball', 'Live and Let Die', 'Moonraker', 'No Time to Die', 'Spectre', 'The Spy Who Loved Me', 'From Russia with Love', 'Diamonds Are Forever', 'Octopussy', 'Quantum of Solace', 'Tomorrow Never Dies', 'You Only Live Twice'], 4: ["On Her Majesty's Secret Service", 'The Living Daylights', 'Licence to Kill', 'A View to a Kill', 'For Your Eyes Only'] }, 3);
  const PRINCESSES = parse(`
Snow White
Cinderella
Aurora|Sleeping Beauty|Briar Rose
Ariel
Belle
Jasmine
Pocahontas
Mulan
Tiana
Rapunzel
Merida
Moana
Raya
Elsa
Anna`, { 1: ['Cinderella', 'Snow White', 'Ariel', 'Belle', 'Jasmine', 'Mulan', 'Moana', 'Elsa'], 2: ['Aurora', 'Rapunzel', 'Pocahontas', 'Tiana', 'Anna'], 4: ['Merida', 'Raya'] }, 3);
  const STAR_WARS = parse(`
The Phantom Menace|Episode I|Episode 1|1|I|Star Wars Episode I|Star Wars Episode 1|Star Wars The Phantom Menace|Star Wars Episode I The Phantom Menace
Attack of the Clones|Episode II|Episode 2|2|II|Star Wars Episode II|Star Wars Episode 2|Star Wars Attack of the Clones|Star Wars Episode II Attack of the Clones
Revenge of the Sith|Episode III|Episode 3|3|III|Star Wars Episode III|Star Wars Episode 3|Star Wars Revenge of the Sith|Star Wars Episode III Revenge of the Sith
A New Hope|Episode IV|Episode 4|4|IV|Star Wars Episode IV|Star Wars Episode 4|Star Wars A New Hope|Star Wars Episode IV A New Hope
The Empire Strikes Back|Empire Strikes Back|Episode V|Episode 5|5|V|Star Wars Episode V|Star Wars Episode 5|Star Wars The Empire Strikes Back|Star Wars Episode V The Empire Strikes Back
Return of the Jedi|Episode VI|Episode 6|6|VI|Star Wars Episode VI|Star Wars Episode 6|Star Wars Return of the Jedi|Star Wars Episode VI Return of the Jedi
The Force Awakens|Episode VII|Episode 7|7|VII|Star Wars Episode VII|Star Wars Episode 7|Star Wars The Force Awakens|Star Wars Episode VII The Force Awakens
The Last Jedi|Episode VIII|Episode 8|8|VIII|Star Wars Episode VIII|Star Wars Episode 8|Star Wars The Last Jedi|Star Wars Episode VIII The Last Jedi
The Rise of Skywalker|Episode IX|Episode 9|9|IX|Star Wars Episode IX|Star Wars Episode 9|Star Wars The Rise of Skywalker|Star Wars Episode IX The Rise of Skywalker
Rogue One|Rogue One: A Star Wars Story
Solo|Solo: A Star Wars Story
The Clone Wars|Clone Wars|Star Wars: The Clone Wars
The Mandalorian and Grogu|Mandalorian and Grogu|Star Wars: The Mandalorian and Grogu`, { 1: ['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi'], 2: ['The Phantom Menace', 'The Force Awakens', 'Rogue One'], 4: ['The Clone Wars'] }, 3);
  const FRIENDS = parse(`
Rachel|Rachel Green
Monica|Monica Geller
Phoebe|Phoebe Buffay
Joey|Joey Tribbiani
Chandler|Chandler Bing
Ross|Ross Geller`, { 2: ['Rachel', 'Ross', 'Joey', 'Chandler', 'Monica', 'Phoebe'] }, 2);
  const AVENGERS = parse(`
Iron Man|Tony Stark
Captain America|Steve Rogers
Thor
Hulk|The Hulk|Bruce Banner
Black Widow|Natasha Romanoff
Hawkeye|Clint Barton`, { 1: ['Iron Man', 'Captain America', 'Thor', 'Hulk'], 2: ['Black Widow'], 3: ['Hawkeye'] }, 2);

  // ---- music ----
  const SWIFT = parse(`
Taylor Swift|Debut
Fearless
Speak Now
Red
1989|Nineteen Eighty Nine
Reputation
Lover
Folklore
Evermore
Midnights
The Tortured Poets Department|TTPD|Tortured Poets Department
The Life of a Showgirl|Life of a Showgirl`, { 1: ['1989', 'Red', 'Fearless', 'Midnights'], 2: ['Reputation', 'Lover', 'Folklore', 'The Tortured Poets Department', 'The Life of a Showgirl', 'Speak Now'], 4: ['Taylor Swift'] }, 3);
  // Beatles songs that reached No. 1 on the Billboard Hot 100. Double A
  // sides credited at No. 1 count both songs.
  const BEATLES_ONES = parse(`
I Want to Hold Your Hand
She Loves You
Can't Buy Me Love
Love Me Do
A Hard Day's Night
I Feel Fine
Eight Days a Week
Ticket to Ride
Help!|Help
Yesterday
We Can Work It Out
Paperback Writer
Penny Lane
All You Need Is Love
Hello, Goodbye|Hello Goodbye
Hey Jude
Get Back
Come Together
Something
Let It Be
The Long and Winding Road
For You Blue`, { 1: ['Hey Jude', 'Let It Be', 'Yesterday', 'Help!', 'I Want to Hold Your Hand', 'Come Together', 'All You Need Is Love'], 2: ['She Loves You', "Can't Buy Me Love", 'Love Me Do', "A Hard Day's Night", 'Penny Lane', 'Something', 'Ticket to Ride', 'Eight Days a Week', 'Get Back'], 4: ['For You Blue', 'Paperback Writer', 'I Feel Fine'] }, 3);
  const THRILLER = parse(`
Wanna Be Startin' Somethin'|Wanna Be Startin Somethin|Wanna Be Starting Something
Baby Be Mine
The Girl Is Mine
Thriller
Beat It
Billie Jean
Human Nature
P.Y.T. (Pretty Young Thing)|PYT|Pretty Young Thing
The Lady in My Life`, { 1: ['Thriller', 'Billie Jean', 'Beat It'], 2: ['Human Nature', "Wanna Be Startin' Somethin'", 'P.Y.T. (Pretty Young Thing)'], 4: ['Baby Be Mine', 'The Lady in My Life'] }, 3);

  // ---- books ----
  const HARRY_POTTER = parse(`
Harry Potter and the Sorcerer's Stone|=Harry Potter and the Philosopher's Stone|Sorcerer's Stone|Philosopher's Stone
Harry Potter and the Chamber of Secrets|Chamber of Secrets
Harry Potter and the Prisoner of Azkaban|Prisoner of Azkaban
Harry Potter and the Goblet of Fire|Goblet of Fire
Harry Potter and the Order of the Phoenix|Order of the Phoenix
Harry Potter and the Half-Blood Prince|Half-Blood Prince|Half Blood Prince
Harry Potter and the Deathly Hallows|Deathly Hallows`, { 2: ["Harry Potter and the Sorcerer's Stone", 'Harry Potter and the Deathly Hallows', 'Harry Potter and the Goblet of Fire', 'Harry Potter and the Chamber of Secrets'] }, 3);
  const NARNIA = parse(`
The Lion, the Witch and the Wardrobe|The Lion the Witch and the Wardrobe
Prince Caspian
The Voyage of the Dawn Treader|Dawn Treader
The Silver Chair
The Horse and His Boy
The Magician's Nephew
The Last Battle`, { 1: ['The Lion, the Witch and the Wardrobe'], 2: ['Prince Caspian', 'The Voyage of the Dawn Treader'] }, 3);
  const AUSTEN = parse(`
Pride and Prejudice
Sense and Sensibility
Emma
Persuasion
Mansfield Park
Northanger Abbey`, { 1: ['Pride and Prejudice'], 2: ['Sense and Sensibility', 'Emma'] }, 3);
  // Shakespeare's plays. Parts of one history count once: Henry VI covers
  // all three parts.
  const SHAKESPEARE = parse(`
All's Well That Ends Well
Antony and Cleopatra
As You Like It
The Comedy of Errors
Coriolanus
Cymbeline
Hamlet
Henry IV|Henry the Fourth
Henry V|Henry the Fifth
Henry VI|Henry the Sixth
Henry VIII|Henry the Eighth
Julius Caesar
King John
King Lear
Love's Labour's Lost|Love's Labor's Lost
Macbeth
Measure for Measure
The Merchant of Venice
The Merry Wives of Windsor
A Midsummer Night's Dream
Much Ado About Nothing
Othello
Pericles
Richard II|Richard the Second
Richard III|Richard the Third
Romeo and Juliet
The Taming of the Shrew
The Tempest
Timon of Athens
Titus Andronicus
Troilus and Cressida
Twelfth Night
The Two Gentlemen of Verona
The Two Noble Kinsmen
The Winter's Tale`, { 1: ['Romeo and Juliet', 'Hamlet', 'Macbeth', 'Othello', 'King Lear', "A Midsummer Night's Dream"], 2: ['Julius Caesar', 'The Tempest', 'Much Ado About Nothing', 'The Merchant of Venice', 'Twelfth Night', 'The Taming of the Shrew', 'Richard III', 'Henry V', 'Antony and Cleopatra'], 4: ['Timon of Athens', 'The Two Noble Kinsmen', 'Pericles', 'Cymbeline', 'Troilus and Cressida', 'King John', 'Henry VIII', 'Henry VI', 'Coriolanus', 'The Two Gentlemen of Verona', "Love's Labour's Lost", 'Titus Andronicus', 'Measure for Measure'] }, 3);

  // ---- things everyone learns ----
  const PLANETS = parse(`
Mercury
Venus
Earth
Mars
Jupiter
Saturn
Uranus
Neptune`, { 1: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] }, 1);
  const CONTINENTS = parse(`
Africa
Antarctica
Asia
Australia|Oceania|Australia and Oceania
Europe
North America
South America`, { 1: ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Australia'], 2: ['Antarctica'] }, 1);
  const RAINBOW = parse(`
Red
Orange
Yellow
Green
Blue
Indigo
Violet|Purple`, { 1: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'], 2: ['Violet'], 3: ['Indigo'] }, 1);
  const DWARFS = parse(`
Doc
Grumpy
Happy
Sleepy
Bashful
Sneezy
Dopey`, { 1: ['Grumpy', 'Happy', 'Sleepy', 'Dopey'], 2: ['Doc', 'Sneezy'], 3: ['Bashful'] }, 2);
  const REINDEER = parse(`
Dasher
Dancer
Prancer
Vixen
Comet
Cupid
Donner|Donder
Blitzen
Rudolph`, { 1: ['Rudolph', 'Dasher', 'Dancer', 'Prancer'], 2: ['Comet', 'Cupid', 'Donner', 'Blitzen', 'Vixen'] }, 2);
  const CHESS = parse(`
King
Queen
Bishop
Knight
Rook|Castle
Pawn`, { 1: ['King', 'Queen', 'Pawn', 'Knight'], 2: ['Bishop', 'Rook'] }, 1);
  const WONDERS = parse(`
Great Pyramid of Giza|Great Pyramid|Pyramids of Giza|Pyramid of Giza
Hanging Gardens of Babylon|Hanging Gardens
Temple of Artemis
Statue of Zeus at Olympia|Statue of Zeus
Mausoleum at Halicarnassus|Mausoleum of Halicarnassus
Colossus of Rhodes
Lighthouse of Alexandria|Pharos of Alexandria`, { 1: ['Great Pyramid of Giza'], 2: ['Hanging Gardens of Babylon', 'Colossus of Rhodes', 'Lighthouse of Alexandria'], 4: ['Mausoleum at Halicarnassus', 'Temple of Artemis'] }, 3);
  // The 28 properties on the standard U.S. Monopoly board.
  const MONOPOLY = parse(`
Mediterranean Avenue|Mediterranean
Baltic Avenue|Baltic
Oriental Avenue|Oriental
Vermont Avenue|Vermont
Connecticut Avenue|Connecticut
St. Charles Place|Saint Charles Place|St Charles Place
States Avenue
Virginia Avenue|Virginia
St. James Place|Saint James Place|St James Place
Tennessee Avenue|Tennessee
New York Avenue
Kentucky Avenue|Kentucky
Indiana Avenue|Indiana
Illinois Avenue|Illinois
Atlantic Avenue|Atlantic
Ventnor Avenue|Ventnor
Marvin Gardens
Pacific Avenue|Pacific
North Carolina Avenue|North Carolina
Pennsylvania Avenue
Park Place
Boardwalk
Reading Railroad|Reading
Pennsylvania Railroad
B&O Railroad|B and O Railroad|Baltimore and Ohio Railroad|B&O
Short Line|Short Line Railroad
Electric Company
Water Works`, { 1: ['Boardwalk', 'Park Place'], 2: ['Reading Railroad', 'Marvin Gardens', 'Baltic Avenue', 'Mediterranean Avenue', 'Electric Company', 'Water Works', 'B&O Railroad', 'Short Line', 'Pennsylvania Railroad'], 4: ['States Avenue', 'Oriental Avenue', 'Ventnor Avenue', 'St. James Place', 'Pacific Avenue'] }, 3);

  // ---- board games and puzzles ----
  // Clue (Cluedo outside North America): the classic six suspects, weapons
  // and nine rooms.
  const CLUE_SUSPECTS = parse(`
Miss Scarlet|Miss Scarlett|Scarlet|Scarlett
Colonel Mustard|Mustard
Mrs. White|Mrs White
Mr. Green|Mr Green|Reverend Green|Rev. Green
Mrs. Peacock|Mrs Peacock|Peacock
Professor Plum|Plum`, { 1: ['Colonel Mustard', 'Miss Scarlet', 'Professor Plum'], 2: ['Mrs. Peacock', 'Mr. Green', 'Mrs. White'] }, 2);
  const CLUE_WEAPONS = parse(`
Candlestick
Knife|Dagger
Lead Pipe|Pipe
Revolver|Gun|Pistol
Rope
Wrench|Spanner`, { 1: ['Candlestick', 'Rope', 'Revolver', 'Knife'], 2: ['Lead Pipe', 'Wrench'] }, 2);
  const CLUE_ROOMS = parse(`
Kitchen
Ballroom|Ball Room
Conservatory
Dining Room
Billiard Room
Library
Lounge
Hall
Study`, { 1: ['Kitchen', 'Library', 'Conservatory', 'Study'], 2: ['Ballroom', 'Dining Room', 'Billiard Room', 'Lounge', 'Hall'] }, 2);
  const RUBIK = parse(`
White
Yellow
Red
Orange
Blue
Green`, { 1: ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Orange'] }, 1);
  const POKER = parse(`
Royal Flush
Straight Flush
Four of a Kind|Quads
Full House
Flush
Straight
Three of a Kind|Trips|Set
Two Pair|Two Pairs
One Pair|Pair
High Card`, { 1: ['Royal Flush', 'Full House', 'Flush', 'Straight', 'Four of a Kind', 'Three of a Kind', 'Two Pair', 'One Pair'], 2: ['Straight Flush', 'High Card'] }, 2);

  // ---- famous people ----
  const BTS = parse(`
RM|Rap Monster|Kim Namjoon|Namjoon
Jin|Kim Seokjin|Seokjin
Suga|Min Yoongi|Yoongi|Agust D
J-Hope|Jhope|Jung Hoseok|Hoseok
Jimin|Park Jimin
V|Kim Taehyung|Taehyung
Jungkook|Jeon Jungkook|Jung Kook`, { 2: ['Jungkook', 'Jimin', 'V', 'Suga', 'Jin', 'RM', 'J-Hope'] }, 2);
  // Portraits on the U.S. bills in circulation.
  const BILLS = parse(`
George Washington|Washington
Thomas Jefferson|Jefferson
Abraham Lincoln|Lincoln
Alexander Hamilton|Hamilton
Andrew Jackson|Jackson
Ulysses S. Grant|Ulysses Grant|Grant
Benjamin Franklin|Ben Franklin|Franklin`, { 1: ['George Washington', 'Abraham Lincoln', 'Benjamin Franklin', 'Alexander Hamilton'], 2: ['Andrew Jackson', 'Thomas Jefferson', 'Ulysses S. Grant'] }, 2);
  const HENRY_WIVES = parse(`
Catherine of Aragon|Katherine of Aragon
Anne Boleyn
Jane Seymour
Anne of Cleves
Catherine Howard|Katherine Howard
Catherine Parr|Katherine Parr`, { 1: ['Anne Boleyn'], 2: ['Catherine of Aragon', 'Jane Seymour'] }, 3);
  // The twelve Olympian gods of Greek myth. Dionysus and Hestia both count.
  const OLYMPIANS = parse(`
Zeus
Hera
Poseidon
Demeter
Athena
Apollo
Artemis
Ares
Aphrodite
Hephaestus|Hephaistos
Hermes
Dionysus|Dionysos
Hestia`, { 1: ['Zeus', 'Poseidon', 'Athena', 'Apollo', 'Aphrodite', 'Hermes', 'Hera'], 2: ['Ares', 'Artemis', 'Dionysus', 'Demeter'], 4: ['Hestia', 'Hephaestus'] }, 3);

  // ---- reality TV ----
  const HOUSEWIVES = parse(`
Orange County|OC
New York City|New York|NYC
Atlanta
New Jersey
D.C.|Washington|Washington D.C.
Beverly Hills
Miami
Potomac
Dallas
Salt Lake City
Dubai
Rhode Island`, { 1: ['New York City', 'Orange County', 'Atlanta', 'Beverly Hills', 'New Jersey'], 2: ['Miami', 'Potomac', 'Salt Lake City'], 4: ['D.C.', 'Rhode Island'] }, 3);
  const KARDASHIANS = parse(`
Kim Kardashian|Kim
Kourtney Kardashian|Kourtney|Kourtney Kardashian Barker
Khloé Kardashian|Khloé|Khloe|Khloe Kardashian
Rob Kardashian|Rob
Kris Jenner|Kris
Kendall Jenner|Kendall
Kylie Jenner|Kylie
Caitlyn Jenner|Caitlyn|Bruce Jenner|Bruce`, { 1: ['Kim Kardashian', 'Kylie Jenner', 'Kris Jenner', 'Kendall Jenner', 'Khloé Kardashian'], 2: ['Kourtney Kardashian', 'Caitlyn Jenner'], 3: ['Rob Kardashian'] }, 3);
  const SHARKS = parse(`
Mark Cuban|Cuban
Barbara Corcoran|Barbara|Corcoran
Lori Greiner|Lori|Greiner
Robert Herjavec|Robert|Herjavec
Daymond John|Daymond
Kevin O'Leary|O'Leary|Mr. Wonderful|Mr Wonderful
Kevin Harrington|Harrington
Daniel Lubetzky|Lubetzky
Emma Grede
Kendra Scott
Rohan Oza
Alex Rodriguez|A-Rod
Gwyneth Paltrow
Jamie Siminoff
Michael Strahan
Chip Gaines
Joanna Gaines
Alexis Ohanian
Fawn Weaver
Allison Ellsworth
Candace Nelson
Todd Graves
Tony Xu
Sara Blakely
Richard Branson
Ashton Kutcher
Chris Sacca
Troy Carter
Bethenny Frankel
Charles Barkley
Matt Higgins
Jeff Foxworthy
John Paul DeJoria
Peter Jones`, { 1: ['Mark Cuban', "Kevin O'Leary", 'Barbara Corcoran', 'Lori Greiner'], 2: ['Daymond John', 'Robert Herjavec'], 4: ['Kevin Harrington', 'Daniel Lubetzky', 'Alex Rodriguez', 'Michael Strahan', 'Ashton Kutcher', 'Richard Branson', 'Gwyneth Paltrow', 'Charles Barkley', 'Sara Blakely', 'Chip Gaines', 'Joanna Gaines'] }, 5);
  const IDOL_JUDGES = parse(`
Simon Cowell|Simon|Cowell
Paula Abdul|Paula|Abdul
Randy Jackson|Randy
Kara DioGuardi|Kara
Ellen DeGeneres|Ellen
Steven Tyler
Jennifer Lopez|J.Lo|JLo
Mariah Carey|Mariah
Nicki Minaj|Nicki
Keith Urban
Harry Connick Jr.|Harry Connick|Harry Connick Jr
Katy Perry|Katy
Lionel Richie|Lionel
Luke Bryan
Carrie Underwood|Carrie`, { 1: ['Simon Cowell', 'Paula Abdul', 'Katy Perry', 'Lionel Richie', 'Luke Bryan', 'Jennifer Lopez', 'Randy Jackson'], 2: ['Carrie Underwood', 'Steven Tyler', 'Mariah Carey', 'Nicki Minaj', 'Harry Connick Jr.', 'Keith Urban'], 4: ['Kara DioGuardi'] }, 3);

  // ---- around the house ----
  const TOOLS = parse(`
Hammer|Claw hammer|Sledgehammer|Sledge hammer
Screwdriver|Phillips screwdriver|Flathead screwdriver|Phillips|Flathead
Wrench|Spanner|Box wrench|Open-end wrench
Pliers
Saw|Handsaw|Hand saw
Tape measure|Measuring tape|Tape
Level|Spirit level
Utility knife|Box cutter|Box knife
Drill|Power drill|Cordless drill
Chisel
File
Mallet|Rubber mallet
Allen wrench|Allen key|Hex key|Hex wrench
Socket wrench|Ratchet|Socket set
Adjustable wrench|Crescent wrench
Pipe wrench
Torque wrench
Hacksaw
Coping saw
Crowbar|Pry bar
Clamp|C-clamp
Vise grips|Vise-Grip|Locking pliers
Needle-nose pliers|Needle nose pliers
Wire cutters
Wire strippers|Wire stripper
Stud finder
Flashlight
Square|Speed square|Carpenter's square|Try square
Putty knife
Sandpaper
Nail set
Awl
Staple gun
Caulk gun|Caulking gun
Tin snips
Voltage tester
Wire brush`, { 1: ['Hammer', 'Screwdriver', 'Wrench', 'Pliers', 'Tape measure', 'Saw', 'Drill', 'Level'], 2: ['Utility knife', 'Allen wrench', 'Socket wrench', 'Adjustable wrench', 'Crowbar', 'Clamp', 'Needle-nose pliers', 'Flashlight', 'Hacksaw', 'Mallet', 'Chisel', 'Sandpaper', 'Wire cutters', 'Stud finder'], 4: ['Coping saw', 'Nail set', 'Awl', 'Tin snips', 'Voltage tester', 'Wire brush', 'Torque wrench'] }, 3);

  // ---- food and drink ----
  const PASTA = parse(`
Spaghetti
Penne
Fettuccine|Fettucine|Fettuccini
Linguine|Linguini
Lasagna|Lasagne
Macaroni|Elbow macaroni|Elbows
Ravioli
Rigatoni
Tortellini
Farfalle|Bow tie|Bow ties|Bowtie
Fusilli
Rotini
Angel hair|Capellini
Orzo
Ziti
Manicotti
Gnocchi
Cannelloni
Tagliatelle
Pappardelle
Orecchiette
Shells|Conchiglie|Pasta shells
Bucatini
Vermicelli
Ditalini
Cavatappi
Gemelli
Campanelle
Radiatori
Paccheri
Cavatelli
Agnolotti
Strozzapreti
Trofie
Casarecce
Mafaldine|Mafalde
Anelli
Stelline
Acini di pepe
Mostaccioli
Spaghettini
Tortelloni`, { 1: ['Spaghetti', 'Penne', 'Fettuccine', 'Lasagna', 'Macaroni', 'Ravioli', 'Linguine'], 2: ['Rigatoni', 'Tortellini', 'Farfalle', 'Fusilli', 'Rotini', 'Angel hair', 'Orzo', 'Ziti', 'Gnocchi', 'Manicotti', 'Shells'], 4: ['Campanelle', 'Radiatori', 'Paccheri', 'Cavatelli', 'Agnolotti', 'Strozzapreti', 'Trofie', 'Casarecce', 'Mafaldine', 'Anelli', 'Stelline', 'Acini di pepe', 'Mostaccioli', 'Spaghettini', 'Tortelloni'] }, 3);
  const CITRUS = parse(`
Orange|Navel orange|Valencia orange
Lemon
Lime
Grapefruit
Tangerine
Clementine
Mandarin|Mandarin orange
Kumquat
Pomelo|Pummelo
Yuzu
Blood orange
Key lime
Bergamot
Citron
Satsuma
Tangelo
Ugli fruit|Ugli
Meyer lemon
Calamansi|Calamondin
Finger lime
Makrut lime|Kaffir lime
Sudachi`, { 1: ['Orange', 'Lemon', 'Lime', 'Grapefruit'], 2: ['Tangerine', 'Clementine', 'Mandarin', 'Blood orange', 'Key lime'], 4: ['Bergamot', 'Citron', 'Tangelo', 'Ugli fruit', 'Calamansi', 'Finger lime', 'Makrut lime'], 5: ['Sudachi'] }, 3);
  const CHEESES = parse(`
Cheddar
Mozzarella
Parmesan|Parmigiano-Reggiano|Parmigiano Reggiano|Parmigiano
Swiss
Brie
Feta
Gouda
Provolone
Ricotta
American
Cream cheese
Cottage cheese
Blue cheese|Bleu cheese|Blue
Goat cheese|Chèvre|Chevre
Camembert
Gruyère
Monterey Jack|Jack
Pepper Jack
Colby
Colby Jack
Gorgonzola
Roquefort
Stilton
Havarti
Muenster|Munster
Manchego
Pecorino|Pecorino Romano|Romano
Asiago
Burrata
Mascarpone
Halloumi
Emmental|Emmentaler
Edam
Fontina
Limburger
Paneer
Queso fresco
Cotija
Oaxaca
Jarlsberg
Wensleydale
Comté
Raclette
Taleggio
Boursin
Red Leicester
Double Gloucester`, { 1: ['Cheddar', 'Mozzarella', 'Parmesan', 'Swiss', 'American', 'Cream cheese'], 2: ['Brie', 'Feta', 'Gouda', 'Provolone', 'Ricotta', 'Cottage cheese', 'Blue cheese', 'Goat cheese', 'Monterey Jack', 'Pepper Jack', 'Colby'], 4: ['Limburger', 'Paneer', 'Cotija', 'Oaxaca', 'Jarlsberg', 'Wensleydale', 'Comté', 'Raclette', 'Taleggio', 'Boursin', 'Red Leicester', 'Double Gloucester', 'Edam', 'Fontina', 'Emmental'] }, 3);
  const WINE_GRAPES = parse(`
Cabernet Sauvignon|Cabernet|Cab
Merlot
Pinot Noir
Chardonnay
Sauvignon Blanc
Riesling
Pinot Grigio|Pinot Gris
Syrah|Shiraz
Zinfandel
Malbec
Moscato|Muscat
Chenin Blanc
Grenache|Garnacha
Tempranillo
Sangiovese
Nebbiolo
Gewürztraminer
Viognier
Cabernet Franc
Petite Sirah
Barbera
Gamay
Carmenère
Albariño
Grüner Veltliner
Pinotage
Mourvèdre|Monastrell
Sémillon
Petit Verdot
Primitivo
Montepulciano
Vermentino
Torrontés
Marsanne
Roussanne
Melon de Bourgogne|Muscadet
Trebbiano|Ugni Blanc
Glera`, { 1: ['Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Chardonnay'], 2: ['Sauvignon Blanc', 'Riesling', 'Pinot Grigio', 'Syrah', 'Zinfandel', 'Malbec', 'Moscato'], 4: ['Gamay', 'Carmenère', 'Albariño', 'Grüner Veltliner', 'Pinotage', 'Mourvèdre', 'Sémillon', 'Petit Verdot', 'Primitivo', 'Vermentino', 'Torrontés', 'Marsanne', 'Roussanne', 'Melon de Bourgogne', 'Trebbiano', 'Glera'] }, 3);

  // Countries that grow coffee or tea, from FAO crop figures, and the
  // members of OPEC after the United Arab Emirates left on May 1, 2026.
  const COMMODITY = {
    coffee: ['Brazil', 'Vietnam', 'Indonesia', 'Colombia', 'Ethiopia', 'Honduras', 'Uganda', 'Peru', 'India', 'Central African Republic', 'Guatemala', 'Guinea', 'Mexico', 'Laos', 'Nicaragua', 'China', "Côte d'Ivoire", 'Costa Rica', 'Tanzania', 'Democratic Republic of the Congo', 'Venezuela', 'Madagascar', 'Kenya', 'Papua New Guinea', 'El Salvador', 'Yemen', 'Philippines', 'Rwanda', 'Cambodia', 'Bolivia', 'Dominican Republic', 'Togo', 'Angola', 'Thailand', 'Panama', 'Malawi', 'Jamaica', 'Haiti', 'Cuba', 'Ecuador', 'Burundi', 'Cameroon', 'Sierra Leone', 'Liberia', 'Ghana', 'Nigeria', 'Zambia', 'Zimbabwe', 'Mozambique', 'Sri Lanka', 'Nepal', 'Myanmar', 'Malaysia', 'Timor-Leste', 'Australia', 'United States', 'Paraguay', 'Trinidad and Tobago', 'Guyana', 'Suriname', 'Gabon', 'Congo', 'Equatorial Guinea', 'Benin', 'Cabo Verde', 'Comoros', 'São Tomé and Príncipe', 'Saudi Arabia', 'Fiji', 'Vanuatu', 'Samoa', 'Tonga', 'Dominica', 'Grenada', 'Saint Vincent and the Grenadines', 'Saint Lucia', 'Mauritius', 'Belize'],
    tea: ['China', 'India', 'Kenya', 'Sri Lanka', 'Turkey', 'Vietnam', 'Indonesia', 'Bangladesh', 'Argentina', 'Japan', 'Uganda', 'Malawi', 'Iran', 'Tanzania', 'Myanmar', 'Rwanda', 'Nepal', 'Thailand', 'Burundi', 'Mozambique', 'Zimbabwe', 'Malaysia', 'Laos', 'Georgia', 'South Korea', 'Ecuador', 'Cameroon', 'Ethiopia', 'Papua New Guinea', 'Brazil', 'Peru', 'Bolivia', 'Azerbaijan', 'Mauritius', 'South Africa', 'Zambia', 'Democratic Republic of the Congo', 'Madagascar', 'Russia', 'Guatemala', 'Bhutan', 'Cambodia', 'Australia', 'United States', 'Portugal', 'United Kingdom', 'New Zealand', 'Colombia', 'Paraguay'],
    opec: ['Algeria', 'Congo', 'Equatorial Guinea', 'Gabon', 'Iran', 'Iraq', 'Kuwait', 'Libya', 'Nigeria', 'Saudi Arabia', 'Venezuela'],
  };
  ELEMENT_LISTS.precious = ['Gold', 'Silver', 'Platinum', 'Palladium', 'Rhodium', 'Iridium', 'Osmium', 'Ruthenium'];


  // ---- books ----
  const DAHL = parse(`
Charlie and the Chocolate Factory|Charlie
Matilda
The BFG|BFG
James and the Giant Peach|James
The Witches|Witches
Fantastic Mr Fox|Fantastic Mr. Fox|Mr Fox
The Twits|Twits
George's Marvellous Medicine|George's Marvelous Medicine
Danny the Champion of the World|Danny
Charlie and the Great Glass Elevator|Great Glass Elevator
The Enormous Crocodile|Enormous Crocodile
Esio Trot
The Magic Finger|Magic Finger
The Giraffe and the Pelly and Me
The Minpins
The Vicar of Nibbleswicke
Revolting Rhymes
Dirty Beasts
The Gremlins
Boy
Going Solo`, { 1: ['Charlie and the Chocolate Factory', 'Matilda', 'The BFG', 'James and the Giant Peach'], 2: ['The Witches', 'Fantastic Mr Fox', 'The Twits'], 4: ['The Giraffe and the Pelly and Me', 'The Minpins', 'The Vicar of Nibbleswicke', 'Revolting Rhymes', 'Dirty Beasts', 'The Gremlins', 'Boy', 'Going Solo', 'The Magic Finger'] }, 3);
  const LITTLE_HOUSE = parse(`
Little House in the Big Woods|Big Woods
Farmer Boy
Little House on the Prairie
On the Banks of Plum Creek|Plum Creek
By the Shores of Silver Lake|Silver Lake
The Long Winter|Long Winter
Little Town on the Prairie
These Happy Golden Years
The First Four Years|First Four Years`, { 1: ['Little House on the Prairie'], 2: ['Little House in the Big Woods', 'On the Banks of Plum Creek'], 4: ['The First Four Years', 'Little Town on the Prairie'] }, 3);
  const DICKENS = parse(`
A Christmas Carol|Christmas Carol
Oliver Twist
Great Expectations
A Tale of Two Cities|Tale of Two Cities
David Copperfield
Bleak House
Hard Times
Little Dorrit
Nicholas Nickleby
The Pickwick Papers|Pickwick Papers
The Old Curiosity Shop|Old Curiosity Shop
Our Mutual Friend
Dombey and Son
Martin Chuzzlewit
Barnaby Rudge
The Mystery of Edwin Drood|Edwin Drood`, { 1: ['A Christmas Carol', 'Oliver Twist', 'Great Expectations', 'A Tale of Two Cities'], 2: ['David Copperfield'], 4: ['Dombey and Son', 'Martin Chuzzlewit', 'Barnaby Rudge', 'The Mystery of Edwin Drood', 'Our Mutual Friend'] }, 3);
  const BRONTE = parse(`
Jane Eyre
Wuthering Heights
Agnes Grey
The Tenant of Wildfell Hall|Tenant of Wildfell Hall
Villette
Shirley
The Professor`, { 1: ['Jane Eyre', 'Wuthering Heights'], 4: ['Agnes Grey', 'The Tenant of Wildfell Hall', 'Villette', 'Shirley', 'The Professor'] }, 3);
  const LITTLE_WOMEN = parse(`
Jo|Jo March|Josephine
Meg|Meg March|Margaret
Beth|Beth March|Elizabeth
Amy|Amy March
Marmee|Mrs. March
Laurie|Theodore Laurence|Teddy
Mr. Laurence|Mr Laurence
Aunt March
John Brooke|Mr. Brooke
Professor Bhaer|Friedrich Bhaer|Fritz
Hannah`, { 1: ['Jo', 'Meg', 'Beth', 'Amy'], 2: ['Laurie', 'Marmee'], 4: ['Mr. Laurence', 'John Brooke', 'Professor Bhaer', 'Hannah'] }, 3);
  const BENNETS = parse(`
Elizabeth|Lizzy|Elizabeth Bennet|Eliza
Jane|Jane Bennet
Mary|Mary Bennet
Kitty|Catherine|Kitty Bennet
Lydia|Lydia Bennet`, { 1: ['Elizabeth', 'Jane'], 2: ['Lydia'], 3: ['Mary', 'Kitty'] }, 2);
  const HUNGER_GAMES = parse(`
The Hunger Games
Catching Fire
Mockingjay
The Ballad of Songbirds and Snakes|Ballad of Songbirds and Snakes
Sunrise on the Reaping
Gregor the Overlander
Gregor and the Prophecy of Bane
Gregor and the Curse of the Warmbloods
Gregor and the Marks of Secret
Gregor and the Code of Claw
Year of the Jungle
When Charlie McButton Lost Power`, { 1: ['The Hunger Games', 'Catching Fire', 'Mockingjay'], 3: ['The Ballad of Songbirds and Snakes', 'Sunrise on the Reaping'], 4: ['Gregor the Overlander'], 5: ['Gregor and the Prophecy of Bane', 'Gregor and the Curse of the Warmbloods', 'Gregor and the Marks of Secret', 'Gregor and the Code of Claw', 'Year of the Jungle', 'When Charlie McButton Lost Power'] }, 2);

  // ---- music and the stage ----
  const SPICE_GIRLS = parse(`
Posh Spice|Posh|Victoria Beckham|Victoria Adams|Victoria
Scary Spice|Scary|Mel B|Melanie Brown
Sporty Spice|Sporty|Mel C|Melanie C|Melanie Chisholm
Baby Spice|Baby|Emma Bunton|Emma
Ginger Spice|Ginger|Geri Halliwell|Geri`, { 1: ['Posh Spice', 'Scary Spice', 'Baby Spice'], 2: ['Sporty Spice', 'Ginger Spice'] }, 2);
  const DESTINYS_CHILD = parse(`
Beyoncé|Beyonce|Beyoncé Knowles|Beyonce Knowles
Kelly Rowland|Kelly
Michelle Williams|Michelle
LeToya Luckett|LeToya
LaTavia Roberson|LaTavia
Farrah Franklin|Farrah`, { 1: ['Beyoncé'], 2: ['Kelly Rowland', 'Michelle Williams'], 4: ['LeToya Luckett', 'LaTavia Roberson', 'Farrah Franklin'] }, 3);
  const LLOYD_WEBBER = parse(`
The Phantom of the Opera|Phantom of the Opera|Phantom
Cats
Evita
Jesus Christ Superstar
Joseph and the Amazing Technicolor Dreamcoat|Joseph|Technicolor Dreamcoat
Sunset Boulevard
School of Rock
Starlight Express
Aspects of Love
Love Never Dies
Whistle Down the Wind
The Woman in White|Woman in White
The Beautiful Game
Cinderella|Bad Cinderella
Tell Me on a Sunday
Song and Dance
By Jeeves|Jeeves
Stephen Ward
The Likes of Us`, { 1: ['The Phantom of the Opera', 'Cats', 'Evita', 'Jesus Christ Superstar', 'Joseph and the Amazing Technicolor Dreamcoat'], 2: ['Sunset Boulevard', 'School of Rock'], 4: ['Aspects of Love', 'Love Never Dies', 'Whistle Down the Wind', 'The Woman in White', 'The Beautiful Game', 'Cinderella', 'Tell Me on a Sunday', 'Song and Dance', 'By Jeeves', 'Stephen Ward', 'The Likes of Us'] }, 3);
  const SOUND_OF_MUSIC = parse(`
Do-Re-Mi|Do Re Mi|Doe a Deer
My Favorite Things|My Favourite Things|Favorite Things
Edelweiss
Climb Ev'ry Mountain|Climb Every Mountain
Sixteen Going on Seventeen|16 Going on 17
The Lonely Goatherd|Lonely Goatherd
So Long, Farewell|So Long Farewell
Maria
I Have Confidence
Something Good
How Can Love Survive
No Way to Stop It
An Ordinary Couple`, { 1: ['Do-Re-Mi', 'My Favorite Things', 'Edelweiss'], 2: ["Climb Ev'ry Mountain", 'Sixteen Going on Seventeen', 'The Lonely Goatherd', 'So Long, Farewell'], 4: ['Something Good', 'How Can Love Survive', 'No Way to Stop It', 'An Ordinary Couple', 'I Have Confidence'] }, 3);
  const GREASE = parse(`
Summer Nights
You're the One That I Want|You're the One That I Want
Greased Lightnin'|Greased Lightning
Hopelessly Devoted to You|Hopelessly Devoted
Beauty School Dropout
Look at Me, I'm Sandra Dee|Sandra Dee
There Are Worse Things I Could Do
We Go Together
Sandy
Born to Hand Jive|Hand Jive
Those Magic Changes
Freddy, My Love|Freddy My Love
It's Raining on Prom Night
Rock 'n' Roll Party Queen`, { 1: ['Summer Nights', "You're the One That I Want", "Greased Lightnin'", 'Hopelessly Devoted to You'], 2: ['Beauty School Dropout', "Look at Me, I'm Sandra Dee", 'We Go Together'], 4: ['Those Magic Changes', 'Freddy, My Love', "It's Raining on Prom Night", "Rock 'n' Roll Party Queen", 'There Are Worse Things I Could Do'] }, 3);

  // ---- TV ----
  const BRIDGERTONS = parse(`
Anthony
Benedict
Colin
Daphne
Eloise
Francesca
Gregory
Hyacinth`, { 2: ['Daphne', 'Anthony', 'Colin', 'Benedict'], 3: ['Eloise', 'Francesca'], 4: ['Gregory', 'Hyacinth'] }, 3);
  const PEANUTS = parse(`
Charlie Brown
Snoopy
Lucy|Lucy van Pelt
Linus|Linus van Pelt
Sally|Sally Brown
Peppermint Patty
Marcie
Schroeder
Pig-Pen|Pigpen|Pig Pen
Woodstock
Franklin
Rerun|Rerun van Pelt
Frieda
Violet
Patty
Shermy
Spike
The Little Red-Haired Girl|Little Red-Haired Girl|Little Red Haired Girl`, { 1: ['Charlie Brown', 'Snoopy', 'Lucy', 'Linus'], 2: ['Woodstock', 'Peppermint Patty', 'Sally', 'Schroeder', 'Pig-Pen'], 4: ['Rerun', 'Frieda', 'Violet', 'Patty', 'Shermy', 'Spike'] }, 3);
  const OZ = parse(`
Dorothy|Dorothy Gale
Toto
Scarecrow|The Scarecrow
Tin Man|The Tin Man|Tin Woodman
Cowardly Lion|The Cowardly Lion|Lion
Glinda|Glinda the Good Witch|Good Witch
Wicked Witch of the West|Wicked Witch|Elphaba
Wicked Witch of the East
Auntie Em|Aunt Em
Uncle Henry
Miss Gulch|Almira Gulch
Munchkins|Munchkin
Flying Monkeys|Flying monkey|Winged Monkeys
Professor Marvel`, { 1: ['Dorothy', 'Toto', 'Scarecrow', 'Tin Man', 'Cowardly Lion'], 2: ['Glinda', 'Wicked Witch of the West', 'Munchkins'], 4: ['Uncle Henry', 'Miss Gulch', 'Professor Marvel', 'Wicked Witch of the East'] }, 3);

  // ---- history ----
  const TUDORS = parse(`
Henry VIII|Henry the Eighth|Henry 8
Elizabeth I|Elizabeth the First|Elizabeth|Queen Elizabeth I|Elizabeth 1
Mary I|Mary|Bloody Mary|Mary Tudor|Mary 1
Henry VII|Henry the Seventh|Henry 7|Henry Tudor
Edward VI|Edward the Sixth|Edward|Edward 6
Lady Jane Grey|Jane Grey|Lady Jane`, { 1: ['Henry VIII', 'Elizabeth I'], 2: ['Mary I'], 3: ['Henry VII', 'Edward VI'], 4: ['Lady Jane Grey'] }, 3);

  // ---- style ----
  const BIRTHSTONES = parse(`
Garnet
Amethyst
Aquamarine
Bloodstone
Diamond
Emerald
Pearl
Moonstone
Alexandrite
Ruby
Peridot
Spinel
Sardonyx
Sapphire
Opal
Tourmaline
Topaz
Citrine
Turquoise
Tanzanite
Zircon`, { 1: ['Diamond', 'Ruby', 'Emerald', 'Sapphire', 'Pearl'], 2: ['Amethyst', 'Garnet', 'Opal', 'Topaz', 'Aquamarine', 'Turquoise'], 4: ['Bloodstone', 'Alexandrite', 'Spinel', 'Sardonyx', 'Zircon'] }, 3);

  // ---- more food and drink ----
  const HERBS = parse(`
Basil
Oregano
Thyme
Rosemary
Sage
Parsley
Cilantro|Coriander
Mint|Peppermint|Spearmint
Dill
Chives
Tarragon
Marjoram
Bay leaf|Bay|Bay leaves|Bay laurel
Lemongrass
Lavender
Chervil
Lovage
Sorrel
Savory|Summer savory
Fennel
Borage
Lemon balm
Lemon verbena
Epazote
Shiso|Perilla`, { 1: ['Basil', 'Oregano', 'Thyme', 'Rosemary', 'Parsley', 'Mint', 'Cilantro'], 2: ['Sage', 'Dill', 'Chives', 'Bay leaf'], 4: ['Chervil', 'Lovage', 'Sorrel', 'Savory', 'Borage', 'Lemon balm', 'Lemon verbena', 'Epazote', 'Shiso'] }, 3);
  const SPICES = parse(`
Cinnamon
Nutmeg
Cloves|Clove
Ginger
Turmeric
Cumin
Paprika|Smoked paprika
Cardamom
Black pepper|Pepper|Peppercorn|Peppercorns
Allspice
Saffron
Star anise
Coriander seed|Coriander seeds
Fenugreek
Mustard seed|Mustard seeds|Mustard
Fennel seed|Fennel seeds
Caraway|Caraway seed
Chili powder|Chile powder
Cayenne|Cayenne pepper
Red pepper flakes|Crushed red pepper|Chili flakes
Sumac
Mace
Vanilla
Juniper|Juniper berries
Anise|Aniseed
Celery seed
Garlic powder
Onion powder
Curry powder
Garam masala
Five spice|Chinese five spice|Five-spice
Za'atar|Zaatar
Pumpkin pie spice|Pumpkin spice
Old Bay
Sesame seed|Sesame seeds|Sesame
Poppy seed|Poppy seeds
White pepper`, { 1: ['Cinnamon', 'Black pepper', 'Paprika', 'Nutmeg', 'Ginger', 'Cumin', 'Turmeric'], 2: ['Cloves', 'Cardamom', 'Saffron', 'Allspice', 'Cayenne', 'Chili powder', 'Garlic powder', 'Curry powder', 'Vanilla'], 4: ['Fenugreek', 'Mace', 'Sumac', 'Juniper', 'Celery seed', 'White pepper', 'Anise'] }, 3);
  const APPLES = parse(`
Granny Smith
Honeycrisp
Gala
Fuji
Red Delicious
Golden Delicious
McIntosh|Macintosh
Pink Lady|Cripps Pink
Braeburn
Jazz
Envy
Ambrosia
Cosmic Crisp
Jonagold
Empire
Cortland
Macoun
Rome|Rome Beauty
Pacific Rose
SweeTango|Sweet Tango
Opal
Crispin|Mutsu
Winesap
Northern Spy
Jonathan
Gravenstein
Zestar
Paula Red
Ginger Gold
Snapdragon
Arkansas Black
Pink Pearl
Cox's Orange Pippin|Cox|Cox's Orange
Bramley|Bramley's Seedling`, { 1: ['Granny Smith', 'Honeycrisp', 'Gala', 'Fuji', 'Red Delicious', 'Golden Delicious', 'McIntosh'], 2: ['Pink Lady', 'Braeburn', 'Jazz', 'Envy', 'Ambrosia', 'Cosmic Crisp'], 4: ['Macoun', 'Pacific Rose', 'Crispin', 'Winesap', 'Northern Spy', 'Jonathan', 'Gravenstein', 'Zestar', 'Paula Red', 'Ginger Gold', 'Snapdragon', 'Arkansas Black', 'Pink Pearl', "Cox's Orange Pippin", 'Bramley', 'Opal'] }, 3);
  const SQUASH = parse(`
Butternut
Acorn
Spaghetti
Zucchini|Courgette
Yellow squash|Summer squash|Yellow
Pumpkin
Delicata
Kabocha
Hubbard
Pattypan|Patty pan
Buttercup
Carnival
Sweet dumpling
Turban
Crookneck|Yellow crookneck
Red kuri|Kuri
Calabaza
Banana squash|Banana
Cushaw
Tromboncino`, { 1: ['Butternut', 'Acorn', 'Spaghetti', 'Zucchini', 'Pumpkin'], 2: ['Yellow squash', 'Delicata'], 4: ['Hubbard', 'Pattypan', 'Buttercup', 'Carnival', 'Sweet dumpling', 'Turban', 'Crookneck', 'Red kuri', 'Calabaza', 'Banana squash', 'Cushaw', 'Tromboncino'] }, 3);
  const STARBUCKS = parse(`
Tall
Grande
Venti
Short
Trenta
Demi`, { 1: ['Tall', 'Grande', 'Venti'], 3: ['Short', 'Trenta'], 4: ['Demi'] }, 2);


  const UNIVERSES = {
    countries: { id: 'countries', items: COUNTRIES, noun: 'a U.N. member state', short: 'U.N. member state' },
    states: { id: 'states', items: US_STATES, noun: 'a U.S. state', short: 'U.S. state' },
    mexico: { id: 'mexico', items: MX_STATES, noun: 'a Mexican state (Mexico City counts)', short: 'Mexican state' },
    elements: { id: 'elements', items: ELEMENTS, noun: 'a chemical element', short: 'element' },
    nba: { id: 'nba', items: NBA, noun: 'an NBA team, by nickname', short: 'NBA team' },
    nfl: { id: 'nfl', items: NFL, noun: 'an NFL team, by nickname', short: 'NFL team' },
    mlb: { id: 'mlb', items: MLB, noun: 'an MLB team, by nickname', short: 'MLB team' },
    nhl: { id: 'nhl', items: NHL, noun: 'an NHL team, by nickname', short: 'NHL team' },
    presidents: { id: 'presidents', items: PRESIDENTS, surname: true, noun: 'the last name of a U.S. president', short: 'president' },
    capitals: { id: 'capitals', items: CAPITALS, noun: 'a national capital', short: 'capital' },
    statecaps: { id: 'statecaps', items: STATE_CAPITALS, noun: 'a U.S. state capital', short: 'state capital' },
    constellations: { id: 'constellations', items: CONSTELLATIONS, noun: 'one of the 88 constellations', short: 'constellation' },
    greek: { id: 'greek', items: GREEK, noun: 'a letter of the Greek alphabet', short: 'Greek letter' },
    nato: { id: 'nato', items: NATO, noun: 'a word in the NATO phonetic alphabet', short: 'NATO alphabet word' },
    bible: { id: 'bible', items: BIBLE, noun: 'a book of the Bible', short: 'book of the Bible' },
    nflcities: { id: 'nflcities', items: CITY_UNIS.nfl, short: 'NFL team city' },
    nbacities: { id: 'nbacities', items: CITY_UNIS.nba, short: 'NBA team city' },
    mlbcities: { id: 'mlbcities', items: CITY_UNIS.mlb, short: 'MLB team city' },
    nhlcities: { id: 'nhlcities', items: CITY_UNIS.nhl, short: 'NHL team city' },
    worldcup: { id: 'worldcup', items: WORLD_CUP, short: 'World Cup winner' },
    ucl: { id: 'ucl', items: UCL_WINNERS, short: 'European champion club' },
    premier: { id: 'premier', items: PREMIER, short: 'Premier League club' },
    olympics: { id: 'olympics', items: OLYMPIC_HOSTS, short: 'Olympic host city' },
    bestpicture: { id: 'bestpicture', items: BEST_PICTURE, short: 'best picture winner' },
    pixar: { id: 'pixar', items: PIXAR, short: 'Pixar film' },
    bond: { id: 'bond', items: BOND, short: 'James Bond film' },
    princesses: { id: 'princesses', items: PRINCESSES, short: 'Disney princess' },
    starwars: { id: 'starwars', items: STAR_WARS, short: '"Star Wars" film' },
    friends: { id: 'friends', items: FRIENDS, short: '"Friends" character' },
    avengers: { id: 'avengers', items: AVENGERS, short: 'Avenger' },
    swift: { id: 'swift', items: SWIFT, short: 'Taylor Swift album' },
    beatles: { id: 'beatles', items: BEATLES_ONES, short: 'Beatles No. 1 song' },
    thriller: { id: 'thriller', items: THRILLER, short: '"Thriller" song' },
    potter: { id: 'potter', items: HARRY_POTTER, short: '"Harry Potter" book' },
    narnia: { id: 'narnia', items: NARNIA, short: '"Narnia" book' },
    austen: { id: 'austen', items: AUSTEN, short: 'Jane Austen novel' },
    shakespeare: { id: 'shakespeare', items: SHAKESPEARE, short: 'Shakespeare play' },
    planets: { id: 'planets', items: PLANETS, short: 'planet' },
    continents: { id: 'continents', items: CONTINENTS, short: 'continent' },
    rainbow: { id: 'rainbow', items: RAINBOW, short: 'rainbow color' },
    dwarfs: { id: 'dwarfs', items: DWARFS, short: 'dwarf' },
    reindeer: { id: 'reindeer', items: REINDEER, short: 'reindeer' },
    chess: { id: 'chess', items: CHESS, short: 'chess piece' },
    wonders: { id: 'wonders', items: WONDERS, short: 'ancient wonder' },
    monopoly: { id: 'monopoly', items: MONOPOLY, short: 'Monopoly property' },
    cluesuspects: { id: 'cluesuspects', items: CLUE_SUSPECTS, short: 'Clue suspect' },
    clueweapons: { id: 'clueweapons', items: CLUE_WEAPONS, short: 'Clue weapon' },
    cluerooms: { id: 'cluerooms', items: CLUE_ROOMS, short: 'Clue room' },
    rubik: { id: 'rubik', items: RUBIK, short: "Rubik's Cube color" },
    poker: { id: 'poker', items: POKER, short: 'poker hand' },
    bts: { id: 'bts', items: BTS, short: 'BTS member' },
    bills: { id: 'bills', items: BILLS, short: 'face on U.S. money' },
    henry: { id: 'henry', items: HENRY_WIVES, short: 'wife of Henry VIII' },
    olympians: { id: 'olympians', items: OLYMPIANS, short: 'Olympian god' },
    housewives: { id: 'housewives', items: HOUSEWIVES, short: '"Real Housewives" city' },
    kardashians: { id: 'kardashians', items: KARDASHIANS, short: 'Kardashian or Jenner' },
    sharks: { id: 'sharks', items: SHARKS, short: '"Shark Tank" shark' },
    idol: { id: 'idol', items: IDOL_JUDGES, short: '"American Idol" judge' },
    tools: { id: 'tools', items: TOOLS, short: 'tool' },
    pasta: { id: 'pasta', items: PASTA, short: 'pasta' },
    citrus: { id: 'citrus', items: CITRUS, short: 'citrus fruit' },
    cheese: { id: 'cheese', items: CHEESES, short: 'cheese' },
    wine: { id: 'wine', items: WINE_GRAPES, short: 'wine grape' },
    dahl: { id: 'dahl', items: DAHL, short: 'Roald Dahl book' },
    littlehouse: { id: 'littlehouse', items: LITTLE_HOUSE, short: '"Little House" book' },
    dickens: { id: 'dickens', items: DICKENS, short: 'Dickens novel' },
    bronte: { id: 'bronte', items: BRONTE, short: 'Brontë novel' },
    littlewomen: { id: 'littlewomen', items: LITTLE_WOMEN, short: '"Little Women" character' },
    bennets: { id: 'bennets', items: BENNETS, short: 'Bennet sister' },
    hungergames: { id: 'hungergames', items: HUNGER_GAMES, short: 'Suzanne Collins book' },
    spice: { id: 'spice', items: SPICE_GIRLS, short: 'Spice Girl' },
    destinys: { id: 'destinys', items: DESTINYS_CHILD, short: "Destiny's Child member" },
    lloydwebber: { id: 'lloydwebber', items: LLOYD_WEBBER, short: 'Lloyd Webber musical' },
    soundofmusic: { id: 'soundofmusic', items: SOUND_OF_MUSIC, short: '"Sound of Music" song' },
    grease: { id: 'grease', items: GREASE, short: '"Grease" song' },
    bridgerton: { id: 'bridgerton', items: BRIDGERTONS, short: 'Bridgerton sibling' },
    peanuts: { id: 'peanuts', items: PEANUTS, short: '"Peanuts" character' },
    oz: { id: 'oz', items: OZ, short: '"Wizard of Oz" character' },
    tudors: { id: 'tudors', items: TUDORS, short: 'Tudor monarch' },
    birthstones: { id: 'birthstones', items: BIRTHSTONES, short: 'birthstone' },
    herbs: { id: 'herbs', items: HERBS, short: 'herb' },
    spices: { id: 'spices', items: SPICES, short: 'spice' },
    apples: { id: 'apples', items: APPLES, short: 'apple' },
    squash: { id: 'squash', items: SQUASH, short: 'squash' },
    starbucks: { id: 'starbucks', items: STARBUCKS, short: 'Starbucks size' },
  };

  const R = typeof Rarity !== 'undefined' ? Rarity : require('./rarity.js');
  for (const u of Object.values(UNIVERSES)) for (const it of u.items) it.fam = (R[u.id] || {})[it.name];

  return { UNIVERSES, COMMODITY, LANDLOCKED, MX_PACIFIC, CONTINENT, REGION, STATE_LISTS, ELEMENT_LISTS, PARTY, PRES_LISTS, TEAM_PLACES, ZODIAC, NEW_TESTAMENT, BEST_PICTURE_RECENT };
})();
if (typeof module !== 'undefined') module.exports = Data;
