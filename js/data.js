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


  // ---- angled questions ----
  // Each angle comes at what people know from a different side: a trait, a
  // word, a person, a place, a time, an everyday moment or a crossover
  // between two worlds. A line may start with a tier from 1 (everyone knows
  // it) to 5 (almost nobody does); lines without one are tier 3. See
  // docs/QUESTION-WRITING.md.
  const parseT = (text) => {
    const tiers = { 1: [], 2: [], 4: [], 5: [] }, lines = [];
    for (const raw of text.trim().split('\n')) {
      const m = raw.trim().match(/^([1-5]) (.*)$/);
      const line = m ? m[2] : raw.trim();
      if (m && m[1] !== '3') tiers[m[1]].push(line.split('|')[0]);
      lines.push(line);
    }
    return parse(lines.join('\n'), tiers, 3);
  };
  const angle = (id, subject, shape, text, spec) => ({ id, subject, shape, text, items: parseT(spec) });
  const ANGLES = [
    angle('red_fruit', 'food', 'trait', 'Name a red fruit.', `
1 Strawberry|Strawberries
1 Cherry|Cherries
1 Apple|Apples|Red apple
1 Raspberry|Raspberries
2 Watermelon
2 Cranberry|Cranberries
2 Pomegranate
Red grape|Red grapes|Grape|Grapes
Tomato
Red currant|Red currants|Currant
Blood orange
4 Lingonberry
4 Goji berry|Goji
4 Lychee
4 Dragon fruit|Pitaya
4 Red plum|Plum
4 Rambutan`),
    angle('yellow_food', 'food', 'trait', 'Name a yellow food.', `
1 Banana|Bananas
1 Lemon|Lemons
1 Corn|Corn on the cob
2 Pineapple
2 Butter
2 Egg yolk|Yolk|Eggs
2 Mustard
Yellow squash|Squash
Yellow pepper|Yellow bell pepper
Popcorn
Custard
Cornbread
Mango
4 Banana pepper
4 Plantain
4 Starfruit
4 Polenta
4 Lemon curd
4 Twinkie|Twinkies
4 Peeps
4 Grapefruit`),
    angle('green_veg', 'food', 'trait', 'Name a green vegetable.', `
1 Broccoli
1 Spinach
1 Peas|Pea
1 Lettuce
1 Green beans|Green bean|String beans
1 Cucumber
1 Celery
2 Kale
2 Asparagus
2 Zucchini
2 Brussels sprouts|Brussel sprouts
2 Cabbage
2 Green pepper|Green bell pepper
Artichoke
Bok choy
Okra
Arugula
Edamame
Snow peas|Sugar snap peas|Snap peas
Leek|Leeks
Collard greens|Collards
Swiss chard|Chard
Romaine
Avocado
4 Watercress
4 Endive
4 Tomatillo`),
    angle('orange_food', 'food', 'trait', 'Name an orange food.', `
1 Carrot|Carrots
1 Pumpkin
2 Sweet potato|Yam
2 Cantaloupe
2 Mango
2 Peach
Apricot
Tangerine
Clementine
Papaya
Butternut squash
Mac and cheese|Macaroni and cheese
Cheetos
Nectarine
4 Persimmon
4 Kumquat
4 Cheddar
4 Salmon`),
    angle('purple_food', 'food', 'trait', 'Name a purple food.', `
1 Eggplant
1 Grape|Grapes
2 Plum|Plums
2 Beet|Beets
Red cabbage|Purple cabbage
Blackberry|Blackberries
Fig|Figs
Red onion|Purple onion
Purple potato
Blueberry|Blueberries
4 Acai|Açaí
4 Ube
4 Passion fruit
4 Prune|Prunes
4 Purple cauliflower
4 Purple carrot`),
    angle('breakfast', 'food', 'everyday', 'Name a breakfast food.', `
1 Pancakes|Pancake
1 Waffles|Waffle
1 Eggs|Egg|Scrambled eggs|Fried eggs
1 Bacon
1 Toast
1 Cereal
2 Oatmeal|Porridge
2 French toast
2 Bagel|Bagels
2 Sausage
2 Hash browns
2 Omelet|Omelette
Muffin|Muffins
Yogurt|Yoghurt
Grits
Biscuits|Biscuit
Croissant
Granola
Crepes|Crepe
Breakfast burrito
Eggs Benedict
Donut|Doughnut|Donuts
Cinnamon roll
Avocado toast
Smoothie
4 Quiche
4 Scone|Scones
4 Huevos rancheros
4 Chilaquiles
4 Shakshuka
4 Corned beef hash|Hash
4 Danish`),
    angle('sandwich', 'food', 'trait', 'Name a kind of sandwich.', `
1 BLT
1 Grilled cheese
1 Peanut butter and jelly|PB&J|PB and J
1 Club|Club sandwich
2 Reuben
2 Ham and cheese
2 Turkey
2 Tuna|Tuna salad|Tuna melt
2 Philly cheesesteak|Cheesesteak
Sloppy Joe
Cuban|Cubano
Monte Cristo
Po' boy|Po boy|Poboy
Banh mi
Muffuletta
French dip
Patty melt
Egg salad
Chicken salad
Meatball sub|Meatball
Sub|Hoagie|Hero|Grinder
Panini
Gyro
Italian sub|Italian
Lobster roll
Pulled pork
Egg and cheese|Bacon egg and cheese|Bacon, egg and cheese
4 Croque monsieur
4 Fluffernutter
4 Cucumber sandwich`),
    angle('pizza_toppings', 'food', 'everyday', 'Name a pizza topping.', `
1 Pepperoni
1 Mushrooms|Mushroom
1 Sausage
1 Cheese|Extra cheese
2 Onions|Onion
2 Green peppers|Peppers|Bell peppers
2 Olives|Black olives
2 Bacon
2 Pineapple
2 Ham
Jalapeños|Jalapeño|Jalapenos|Jalapeno
Spinach
Tomatoes|Tomato
Chicken
Anchovies|Anchovy
Basil
Garlic
Ground beef|Beef|Hamburger
Artichoke|Artichokes
Banana peppers
Feta
Meatballs|Meatball
Red onion
Arugula
Prosciutto
Ricotta
Sun-dried tomatoes
Broccoli
Shrimp
Salami
Canadian bacon
4 Capers
4 Eggplant
4 Hot honey`),
    angle('cake_kinds', 'food', 'trait', 'Name a kind of cake.', `
1 Chocolate
1 Carrot
1 Cheesecake
1 Red velvet
2 Angel food
2 Pound
2 Coffee cake
2 Birthday
2 Vanilla|Yellow|White
Sponge|Victoria sponge
Lemon
Funfetti
Black Forest
German chocolate
Tres leches
Pineapple upside-down|Upside-down
Bundt
Fruitcake
Ice cream cake
Strawberry shortcake|Shortcake
Devil's food
Lava cake|Molten chocolate|Molten lava
Marble
Spice
Coconut
Wedding cake
Cupcake|Cupcakes
Rum cake
4 Boston cream pie
4 Opera cake
4 Battenberg
4 Hummingbird
4 Italian cream
4 Chiffon`),
    angle('before_cake', 'words', 'wordplay', 'Name a word that comes before "cake."', `
1 Cheese|Cheesecake
1 Cup|Cupcake
1 Pan|Pancake
2 Birthday
2 Wedding
2 Carrot
2 Coffee
2 Pound
2 Fruit|Fruitcake
Short|Shortcake
Sponge
Angel
Crab
Sheet
Layer
Rice
Fish
Funnel
Lava
Hot|Hotcake
Patty|Pattycake
Johnny|Johnnycake
Oat|Oatcake
Tea|Teacake
Mud
Snack
Spice`),
    angle('before_ball', 'words', 'wordplay', 'Name a word that comes before "ball."', `
1 Base|Baseball
1 Basket|Basketball
1 Foot|Football
1 Soft|Softball
1 Volley|Volleyball
1 Snow|Snowball
2 Dodge|Dodgeball
2 Meat|Meatball
2 Eye|Eyeball
2 Fire|Fireball
2 Pin|Pinball
2 Gum|Gumball
2 Beach|Beach ball
Hand|Handball
Odd|Oddball
Golf|Golf ball
Cannon|Cannonball
Screw|Screwball
Hair|Hairball
Moth|Mothball
Cotton|Cotton ball
Paint|Paintball
Crystal|Crystal ball
Kick|Kickball
Pickle|Pickleball
Butter|Butterball
Racquet|Racquetball
Wiffle|Wiffle ball
Disco|Disco ball
Curve|Curveball
Fast|Fastball
Spit|Spitball
Wrecking|Wrecking ball
Net|Netball
Fur|Furball
Hard|Hardball
Puff|Puffball
Matzo|Matzo ball`),
    angle('after_birthday', 'words', 'wordplay', 'Name a word that comes after "birthday."', `
1 Cake
1 Party
1 Card
1 Present|Presents|Gift|Gifts
1 Candles|Candle
2 Song
2 Girl
2 Boy
2 Wish
2 Balloon|Balloons
Hat
Suit
Dinner
Bash
Celebration
Month
Week
Banner`),
    angle('before_house', 'words', 'wordplay', 'Name a word that comes before "house."', `
1 White|White House
1 Green|Greenhouse
1 Light|Lighthouse
1 Dog|Doghouse
1 Farm|Farmhouse
1 Tree|Treehouse
2 Club|Clubhouse
2 Coffee|Coffeehouse
2 Fire|Firehouse
2 Bird|Birdhouse
2 Boat|Boathouse
2 Doll|Dollhouse
2 Guest|Guesthouse
2 Out|Outhouse
2 Play|Playhouse
2 Court|Courthouse
2 Ware|Warehouse
2 Haunted|Haunted house
2 Beach|Beach house
Hen|Henhouse
Ice|Icehouse
Power|Powerhouse
Round|Roundhouse
School|Schoolhouse
Steak|Steakhouse
Store|Storehouse
Summer|Summerhouse
Town|Townhouse
Bath|Bathhouse
Pent|Penthouse
Opera|Opera house
Fun|Funhouse
Mad|Madhouse
Glass|Glasshouse
Smoke|Smokehouse
Gate|Gatehouse
Boarding|Boarding house
Full|Full house
Open|Open house
Safe|Safe house
Work|Workhouse
Alms|Almshouse
Frat|Frat house
Pool|Pool house
Tea|Teahouse
Jail|Jailhouse
Slaughter|Slaughterhouse`),
    angle('sun_words', 'words', 'wordplay', 'Name something with "sun" at the start of its name.', `
1 Sunflower
1 Sunday
1 Sunscreen
1 Sunglasses
1 Sunshine
1 Sunset
1 Sunrise
2 Sunburn
2 Sundae
2 Sunroof
2 Sunlight
Sunbeam
Sundial
Sunblock
Sunchips|Sun Chips
Sunkist
Sunny D|SunnyD
Sunfish
Sun hat
Sunspot
Sunstroke
Sunroom|Sun porch
Sundown
Sunlamp
Sunbather|Sunbathing
Sunstone
Sundress`),
    angle('color_songs', 'music', 'wordplay', 'Name a song with a color in its title.', `
1 Purple Rain
1 Yellow Submarine
1 Blue Suede Shoes
1 Back in Black
1 White Christmas
2 Lady in Red|The Lady in Red
2 Paint It Black|Paint It, Black
2 Red Red Wine
2 Yellow
2 Brown Eyed Girl
2 Blue Moon
2 Little Red Corvette
2 Purple Haze
2 Goodbye Yellow Brick Road|Yellow Brick Road
2 Mr. Blue Sky|Mr Blue Sky
Blue (Da Ba Dee)|Blue Da Ba Dee
Green Onions
Black Magic Woman
Blue Bayou
White Rabbit
Nights in White Satin
Behind Blue Eyes
Big Yellow Taxi
Green Light
Black Hole Sun
Orange Crush
Redbone
Blue Velvet
Red
White Wedding
Black Velvet
Forever in Blue Jeans
Purple People Eater|The Purple People Eater
Blue Christmas
Green, Green Grass of Home|Green Green Grass of Home
Pink Houses
Black or White
Blue Jean
Red Light
Yellow Ledbetter`),
    angle('day_songs', 'music', 'wordplay', 'Name a song with a day of the week in its title.', `
1 Manic Monday
1 Friday I'm in Love
1 Ruby Tuesday
1 Sunday Bloody Sunday
2 Saturday Night's Alright for Fighting|Saturday Night's Alright (for Fighting)
2 Monday, Monday|Monday Monday
2 Rainy Days and Mondays
2 I Don't Like Mondays
2 Friday
2 Saturday in the Park
Tuesday's Gone
Sunday Morning
Blue Monday
Saturday Night
Last Friday Night (T.G.I.F.)|Last Friday Night
Come Monday
New Moon on Monday
Friday on My Mind
Stormy Monday|They Call It Stormy Monday
A Sunday Kind of Love|Sunday Kind of Love
Gloomy Sunday
Lazy Sunday
Wednesday Morning, 3 A.M.|Wednesday Morning 3 AM
Thursday
Saturday Sun
Friday Night
Sunday Girl`),
    angle('famous_taylor', 'people', 'people', 'Name a famous Taylor.', `
1 Taylor Swift
1 Elizabeth Taylor
1 James Taylor
2 Taylor Lautner
2 Zachary Taylor
2 Lawrence Taylor
Taylor Hicks
Taylor Kitsch
Taylor Momsen
Taylor Tomlinson
Taylor Sheridan
Taylor Hawkins
Roger Taylor
Taylor Dayne
Chuck Taylor
Taylor Fritz
Taylor Townsend
Taylor Russell
Taylor Kinney
Taylor Schilling
Christine Taylor
Holland Taylor
Lili Taylor
Rip Taylor
Rod Taylor
Robert Taylor
Johnnie Taylor
Koko Taylor
Mick Taylor
Andy Taylor
John Taylor
Jonathan Taylor
Taylor Hall
Taylor Zakhar Perez
Taylor Frankie Paul`),
    angle('famous_jennifer', 'people', 'people', 'Name a famous Jennifer.', `
1 Jennifer Aniston
1 Jennifer Lopez|J.Lo|JLo
1 Jennifer Lawrence
1 Jennifer Garner
1 Jennifer Hudson
2 Jennifer Coolidge
2 Jennifer Love Hewitt
2 Jennifer Connelly
2 Jennifer Grey
Jennifer Beals
Jennifer Tilly
Jennifer Jason Leigh
Jennifer Capriati
Jennifer Holliday
Jennifer Nettles
Jennifer Jones
Jennifer Saunders
Jennifer Ehle
Jennifer Morrison
Jennifer Esposito
Jennifer Lewis
Jennifer Doudna
Jennifer Granholm
Jennifer Egan
Jennifer Weiner
Jennifer Rush
Jennifer Paige
Jennifer Lame
Jennifer Westfeldt
Jennifer Carpenter
Jennifer Hale
Jennifer Ortiz`),
    angle('one_name_singer', 'music', 'people', 'Name a singer known by one name.', `
1 Madonna
1 Cher
1 Adele
1 Rihanna
1 Beyoncé|Beyonce
1 Prince
1 Shakira
2 Sting
2 Bono
2 Drake
2 Eminem
2 Usher
2 Lizzo
2 Seal
2 Pink|P!nk
2 Sia
2 Lorde
2 Selena
2 Brandy
2 Aaliyah
2 Ciara
2 Fergie
2 Kesha|Ke$ha
2 Halsey
2 Enya
Björk|Bjork
Rosalía|Rosalia
Monica
Dido
Sade
Jewel
Yanni
Liberace
Donovan
Morrissey
Nelly
Ludacris
Pitbull
Akon
Ne-Yo|NeYo
Moby
Charo
Lulu
Melanie
Raye
Tiësto|Tiesto
Avicii
Zayn
Common
Mýa|Mya
Ashanti
Tiffany
Raven|Raven-Symoné`),
    angle('bond_actors', 'movies', 'people', 'Name an actor who played James Bond.', `
1 Sean Connery|Connery
1 Roger Moore|Moore
1 Pierce Brosnan|Brosnan
1 Daniel Craig|Craig
2 Timothy Dalton|Dalton
4 George Lazenby|Lazenby
5 David Niven|Niven
5 Barry Nelson`),
    angle('batman_actors', 'movies', 'people', 'Name an actor who played Batman.', `
1 Michael Keaton|Keaton
1 Christian Bale|Bale
1 Ben Affleck|Affleck
1 George Clooney|Clooney
2 Adam West
2 Val Kilmer|Kilmer
2 Robert Pattinson|Pattinson
4 Kevin Conroy
4 Will Arnett
5 Lewis Wilson
5 Robert Lowery`),
    angle('ny_movies', 'movies', 'place', 'Name a movie set in New York City.', `
1 Ghostbusters
1 Home Alone 2|Home Alone 2: Lost in New York
1 Elf
1 When Harry Met Sally|When Harry Met Sally...
1 Breakfast at Tiffany's
1 The Godfather
1 King Kong
1 Spider-Man
1 The Devil Wears Prada
1 Sex and the City
2 Taxi Driver
2 Annie Hall
2 Manhattan
2 Big
2 Enchanted
2 Tootsie
2 Wall Street
2 West Side Story
2 Do the Right Thing
2 Goodfellas
2 Night at the Museum
2 The Avengers
2 Miracle on 34th Street
2 You've Got Mail
2 Serendipity
2 Hitch
2 Men in Black
2 Annie
2 Saturday Night Fever
2 Working Girl
2 Coming to America
2 Stuart Little
2 Ghost
2 Moonstruck
2 Maid in Manhattan
2 13 Going on 30
2 The Wolf of Wall Street
2 Joker
2 I Am Legend
2 Crocodile Dundee
2 Splash
Kramer vs. Kramer|Kramer vs Kramer
Midnight Cowboy
Mean Streets
The Warriors
Cloverfield
Rosemary's Baby
Fame
The French Connection
Dog Day Afternoon
Birdman
Uncut Gems
Big Daddy
Godzilla
The Day After Tomorrow
Hannah and Her Sisters
Black Swan
Inside Llewyn Davis
Frances Ha
Precious
Eyes Wide Shut
How to Lose a Guy in 10 Days
Friends with Benefits
The Intern
Wonder Woman 1984
Ocean's 8
Anora
Gangs of New York
Leon: The Professional|The Professional|Léon
Sleepless in Seattle`),
    angle('paris_movies', 'movies', 'place', 'Name a movie set in Paris.', `
1 Ratatouille
1 Midnight in Paris
1 Moulin Rouge!|Moulin Rouge
2 Amélie|Amelie
2 An American in Paris
2 The Da Vinci Code
2 Les Misérables|Les Miserables
2 Hugo
2 Taken
2 The Hunchback of Notre Dame
2 The Aristocats
2 Julie & Julia|Julie and Julia
2 Funny Face
2 Charade
2 Gigi
2 French Kiss
Before Sunset
Paris, je t'aime|Paris je t'aime
Ronin
Breathless
The 400 Blows
La Haine
Last Tango in Paris
Frantic
Something's Gotta Give
The Bourne Identity
Inception
Sabrina
Marie Antoinette
Phantom of the Opera|The Phantom of the Opera
Mission: Impossible – Fallout|Mission Impossible Fallout
Lupin
The Intouchables
Cléo from 5 to 7|Cleo from 5 to 7
Coco Before Chanel
Moulin`),
    angle('hospital_tv', 'tv', 'place', 'Name a TV show set in a hospital.', `
1 Grey's Anatomy
1 ER
1 Scrubs
1 House|House M.D.
1 M*A*S*H|MASH
2 Chicago Med
2 The Good Doctor
2 The Resident
2 The Pitt
2 General Hospital
2 St. Elsewhere|St Elsewhere
2 New Amsterdam
2 Doogie Howser, M.D.|Doogie Howser
Private Practice
Code Black
Nurse Jackie
Chicago Hope
Call the Midwife
Transplant
Doc
St. Denis Medical|St Denis Medical
Pulse
Brilliant Minds
Watson
Mercy
Trauma
Royal Pains
The Knick
Holby City
Casualty
Doc Martin
Hawthorne
Saving Hope`),
    angle('school_tv', 'tv', 'place', 'Name a TV show set in a high school.', `
1 Glee
1 Saved by the Bell
1 Euphoria
2 Freaks and Geeks
2 Degrassi|Degrassi: The Next Generation
2 Beverly Hills, 90210|90210|Beverly Hills 90210
2 Friday Night Lights
2 Never Have I Ever
2 13 Reasons Why
2 Sex Education
2 Welcome Back, Kotter|Welcome Back Kotter
2 Gossip Girl
2 Riverdale
2 Boy Meets World
Dawson's Creek
One Tree Hill
Veronica Mars
Heartstopper
My So-Called Life
Pretty Little Liars
Elite
High School Musical: The Musical: The Series
Ginny & Georgia|Ginny and Georgia
Cobra Kai
Wednesday
Buffy the Vampire Slayer
Malcolm in the Middle
Everybody Hates Chris
The O.C.|The OC
Popular
Boston Public
Grange Hill
Skins
Moesha
Sabrina the Teenage Witch
Lizzie McGuire
Zoey 101
Gilmore Girls
XO, Kitty|XO Kitty`),
    angle('ny_sitcoms', 'tv', 'place', 'Name a sitcom set in New York.', `
1 Friends
1 Seinfeld
1 How I Met Your Mother
1 Brooklyn Nine-Nine|Brooklyn 99
2 30 Rock
2 Will & Grace|Will and Grace
2 The King of Queens
2 Everybody Hates Chris
2 The Nanny
2 Mad About You
2 2 Broke Girls|Two Broke Girls
2 Taxi
2 The Honeymooners
2 The Jeffersons
2 Only Murders in the Building
2 Sex and the City
2 Unbreakable Kimmy Schmidt
Girls
Broad City
The Marvelous Mrs. Maisel|Marvelous Mrs. Maisel
Spin City
Russian Doll
Ugly Betty
Night Court
Barney Miller
The Odd Couple
I Love Lucy
Welcome Back, Kotter|Welcome Back Kotter
Living Single
Difficult People
Younger
Rhoda
1 The Cosby Show|Cosby Show|Cosby
2 Everybody Loves Raymond|Raymond
2 Diff'rent Strokes|Different Strokes|Diffrent Strokes
Kate & Allie|Kate and Allie
Just Shoot Me!|Just Shoot Me
Becker
Veronica's Closet
Rules of Engagement
The Mindy Project|Mindy Project
Master of None
Girls5eva
Kevin Can Wait
Bored to Death
4 Louie
4 Search Party
4 Ghosts
4 Car 54, Where Are You?|Car 54
4 The Patty Duke Show|Patty Duke Show
4 High Maintenance
4 Mr. Mayor
4 Great News
4 Whitney
4 Brooklyn Bridge
4 The Phil Silvers Show|Sgt. Bilko`),
    angle('roman_planets', 'science', 'crossover', 'Name a planet named after a Roman god.', `
1 Mars
1 Venus
1 Jupiter
1 Mercury
1 Saturn
2 Neptune`),
    angle('person_countries', 'geo', 'crossover', 'Name a country named after a person.', `
1 United States|USA|America|United States of America
1 Colombia
1 Bolivia
1 Philippines
1 Saudi Arabia
2 Israel
2 El Salvador
2 Dominican Republic
2 Saint Lucia
Saint Kitts and Nevis
Saint Vincent and the Grenadines
São Tomé and Príncipe|Sao Tome and Principe
San Marino
Liechtenstein
Marshall Islands
Solomon Islands
Seychelles
Mauritius
Nicaragua
Eswatini|Swaziland
Mozambique
Uzbekistan`),
    angle('person_states', 'geo', 'crossover', 'Name a U.S. state named after a person.', `
1 Washington
1 Virginia
1 Georgia
2 West Virginia
2 Pennsylvania
2 Maryland
2 Louisiana
2 North Carolina
2 South Carolina
2 New York
Delaware`),
    angle('december_holidays', 'holidays', 'time', 'Name a holiday in December.', `
1 Christmas
1 Hanukkah|Chanukah
1 Kwanzaa
1 New Year's Eve
1 Christmas Eve
2 Boxing Day
2 Winter solstice|Solstice
2 Festivus
St. Nicholas Day|Saint Nicholas Day
Las Posadas
Yule
St. Lucia Day|Santa Lucia|Saint Lucy's Day
Pearl Harbor Remembrance Day|Pearl Harbor Day
Feast of Our Lady of Guadalupe|Our Lady of Guadalupe
Bodhi Day
Human Rights Day
Omisoka|Ōmisoka
Feast of the Immaculate Conception|Immaculate Conception`),
    angle('junk_drawer', 'home', 'everyday', 'Name something you\'d find in a junk drawer.', `
1 Batteries|Battery
1 Rubber bands|Rubber band
1 Takeout menus|Menus|Menu
1 Tape|Scotch tape
1 Scissors
1 Pens|Pen
1 Keys|Key
2 Paper clips|Paper clip
2 Twist ties|Twist tie
2 Matches
2 Birthday candles|Candles
2 Screwdriver
2 Flashlight
2 Coupons
2 Chopsticks
2 Ketchup packets|Soy sauce packets|Condiment packets|Sauce packets
2 Thumbtacks|Pushpins
2 Glue|Super glue
2 Sticky notes|Post-its|Post-it notes
2 Lighter
2 Chargers|Charger|Phone charger|Cables|Cords
2 Pencils|Pencil
2 Coins|Change
Safety pins
Tape measure|Measuring tape
Zip ties
String|Twine
Receipts
Manuals|Instruction manuals
Allen wrench|Allen wrenches|Allen keys
Stamps
Notepad
Magnets
Light bulbs
Gum
Sunglasses
Bottle opener`),
    angle('beach_bag', 'home', 'everyday', 'Name something people pack for the beach.', `
1 Sunscreen
1 Towel|Beach towel
1 Umbrella|Beach umbrella
1 Sunglasses
1 Swimsuit|Bathing suit|Swimming suit
1 Hat|Sun hat
2 Cooler
2 Beach chair|Chair|Chairs
2 Water|Water bottle
2 Snacks
2 Book
2 Sandals|Flip-flops|Flip flops
2 Bucket|Pail
2 Shovel
2 Frisbee
2 Beach ball|Volleyball
Speaker
Phone
Blanket
Boogie board
Sand toys
Cover-up
Lip balm
Aloe
Bug spray
Goggles
Snorkel
Kite
Drinks
Sandwiches`),
    angle('family_games', 'games', 'everyday', 'Name a board game families play.', `
1 Monopoly
1 Scrabble
1 Clue
1 Sorry!|Sorry
1 Candy Land
1 Chutes and Ladders
1 The Game of Life|Life
1 Checkers
1 Chess
2 Trouble
2 Risk
2 Operation
2 Battleship
2 Connect Four|Connect 4
2 Yahtzee
2 Pictionary
2 Trivial Pursuit
2 Catan|Settlers of Catan
2 Ticket to Ride
2 Mouse Trap
2 Hungry Hungry Hippos
2 Guess Who?|Guess Who
2 Uno
Stratego
Othello
Parcheesi
Backgammon
Mancala
Boggle
Apples to Apples
Sequence
Taboo
Cranium
Scattergories
Codenames
Pandemic
Carcassonne
Twister
Blokus
Rummikub
Chinese checkers
Aggravation
Kerplunk
Jenga
Headbanz
Mastermind
Payday`),
    angle('card_games', 'games', 'category', 'Name a card game.', `
1 Poker
1 Solitaire
1 Go Fish
1 Blackjack|21
1 War
1 Uno
2 Hearts
2 Spades
2 Gin rummy|Rummy|Gin
2 Crazy Eights|Crazy 8s
2 Old Maid
2 Bridge
2 Euchre
2 Spoons
2 Speed
Cribbage
Canasta
Slapjack
Spit
Baccarat
Pinochle
Egyptian Ratscrew|Egyptian Rat Screw
President
Hand and Foot
Phase 10
Skip-Bo
Rook
Concentration|Memory
Snap
Kings in the Corner|Kings Corner
Oh Hell
Pitch
Whist
Cheat|I Doubt It
Texas Hold'em|Texas Holdem
Bezique
Durak
Piquet`),
    angle('christmas_songs', 'music', 'time', 'Name a Christmas song.', `
1 Jingle Bells
1 Silent Night
1 White Christmas
1 Rudolph the Red-Nosed Reindeer|Rudolph
1 Frosty the Snowman
1 All I Want for Christmas Is You
1 Last Christmas
1 Feliz Navidad
1 Jingle Bell Rock
1 Rockin' Around the Christmas Tree
1 Deck the Halls
1 Joy to the World
1 The Twelve Days of Christmas|Twelve Days of Christmas
1 Let It Snow!|Let It Snow|Let It Snow! Let It Snow! Let It Snow!
1 Santa Claus Is Comin' to Town|Santa Claus Is Coming to Town
2 O Holy Night
2 Have Yourself a Merry Little Christmas
2 Blue Christmas
2 Here Comes Santa Claus
2 Chestnuts Roasting on an Open Fire
2 Little Drummer Boy|The Little Drummer Boy
2 Away in a Manger
2 O Come, All Ye Faithful|O Come All Ye Faithful
2 Hark! The Herald Angels Sing|Hark the Herald Angels Sing
2 It's Beginning to Look a Lot Like Christmas
2 Sleigh Ride
2 Winter Wonderland
2 Silver Bells
2 We Wish You a Merry Christmas
2 Santa Baby
2 A Holly Jolly Christmas|Holly Jolly Christmas
2 It's the Most Wonderful Time of the Year
2 Grandma Got Run Over by a Reindeer
2 Mary, Did You Know?|Mary Did You Know
2 Carol of the Bells
2 Do You Hear What I Hear?|Do You Hear What I Hear
Mele Kalikimaka
Run Rudolph Run
Happy Xmas (War Is Over)|Happy Xmas|War Is Over
Wonderful Christmastime
Do They Know It's Christmas?|Do They Know It's Christmas
Underneath the Tree
Christmas (Baby Please Come Home)|Baby Please Come Home
I Saw Mommy Kissing Santa Claus
God Rest Ye Merry Gentlemen
O Christmas Tree
The First Noel|The First Noël
What Child Is This?|What Child Is This
Little Saint Nick
Christmas Tree Farm
Santa Tell Me
Merry Christmas Darling
Please Come Home for Christmas
Baby, It's Cold Outside|Baby It's Cold Outside
I'll Be Home for Christmas
Up on the Housetop
Good King Wenceslas`),
    angle('nursery_rhymes', 'kids', 'category', 'Name a nursery rhyme.', `
1 Twinkle, Twinkle, Little Star|Twinkle Twinkle Little Star
1 Mary Had a Little Lamb
1 Humpty Dumpty
1 Jack and Jill
1 Hickory Dickory Dock
1 Itsy Bitsy Spider|Incy Wincy Spider
1 Baa, Baa, Black Sheep|Baa Baa Black Sheep
1 Row, Row, Row Your Boat|Row Row Row Your Boat
1 Old MacDonald Had a Farm|Old MacDonald
1 Rock-a-bye Baby|Rock a Bye Baby
2 London Bridge Is Falling Down|London Bridge
2 Ring Around the Rosie|Ring a Ring o' Roses
2 Hey Diddle Diddle
2 Little Bo-Peep|Little Bo Peep
2 Little Miss Muffet
2 Three Blind Mice
2 Pat-a-Cake|Patty Cake
2 This Little Piggy
2 The Wheels on the Bus|Wheels on the Bus
2 Hush, Little Baby|Hush Little Baby
2 Rain, Rain, Go Away|Rain Rain Go Away
2 Pop Goes the Weasel
2 Old Mother Hubbard
2 Jack Be Nimble
2 Little Jack Horner
2 Hot Cross Buns
2 Five Little Monkeys
2 The Muffin Man|Do You Know the Muffin Man
2 Are You Sleeping?|Frère Jacques|Frere Jacques
Sing a Song of Sixpence
Yankee Doodle
Pease Porridge Hot
Georgie Porgie
Little Boy Blue
Peter Piper
Simple Simon
Wee Willie Winkie
Polly Put the Kettle On
Jack Sprat
Ding Dong Bell
Mary, Mary, Quite Contrary|Mary Mary Quite Contrary
The Grand Old Duke of York|Grand Old Duke of York
One, Two, Buckle My Shoe|One Two Buckle My Shoe
Rub-a-dub-dub|Rub a Dub Dub
There Was an Old Woman Who Lived in a Shoe
Ladybird, Ladybird`),
    angle('striped_animals', 'nature', 'trait', 'Name an animal with stripes.', `
1 Zebra
1 Tiger
1 Skunk
1 Bee|Bumblebee|Honeybee
2 Raccoon
2 Chipmunk
2 Clownfish
2 Tabby cat|Tabby
2 Lemur|Ring-tailed lemur
Okapi
Bongo
Hyena|Striped hyena
Numbat
Badger
Wasp|Yellow jacket
Garter snake
Coral snake
Zebrafish
Kudu
Nyala
Thomson's gazelle
Lionfish
Angelfish
Tasmanian tiger|Thylacine
Quagga
Striped bass
Sergeant major
Tiger shark
Banded mongoose`),
    angle('boneless_sea', 'nature', 'trait', 'Name a sea creature with no bones.', `
1 Jellyfish
1 Octopus
1 Squid
1 Starfish|Sea star
1 Crab
1 Lobster
1 Shrimp
2 Sea urchin
2 Sea cucumber
2 Sponge
2 Coral
2 Sea anemone|Anemone
2 Clam
2 Oyster
2 Mussel
2 Scallop
2 Cuttlefish
2 Sand dollar
Sea snail|Snail|Conch|Whelk
Sea slug|Nudibranch
Nautilus
Krill
Barnacle
Portuguese man o' war|Man o' war
Sea sponge
Hermit crab
Horseshoe crab
Sea pen
Comb jelly`),
    angle('baby_animals', 'nature', 'wordplay', 'Name a word for a baby animal.', `
1 Puppy|Pup
1 Kitten|Kitty
1 Calf
1 Foal
1 Cub
1 Chick
1 Duckling
1 Lamb
1 Piglet
2 Kid
2 Fawn
2 Joey
2 Gosling
2 Tadpole
2 Bunny|Kit
2 Owlet
2 Cygnet
2 Hatchling
Eaglet
Leveret
Fry
Larva
Caterpillar
Squab
Poult
Cria
Colt
Filly
Whelp
Spat
Nymph
Elver
Fledgling
Nestling
Infant`),
    angle('terriers', 'nature', 'wordplay', 'Name a dog breed with "terrier" in its name.', `
1 Yorkshire Terrier|Yorkie
1 Jack Russell Terrier|Jack Russell
1 Boston Terrier
1 Bull Terrier
2 Scottish Terrier|Scottie
2 West Highland White Terrier|Westie
2 Airedale Terrier|Airedale
2 Fox Terrier|Wire Fox Terrier|Smooth Fox Terrier
2 Pit Bull Terrier|Pit bull|American Pit Bull Terrier
2 Staffordshire Bull Terrier|Staffy|Staffie
Rat Terrier
Cairn Terrier
Border Terrier
Soft Coated Wheaten Terrier|Wheaten Terrier|Wheaten
American Staffordshire Terrier|AmStaff
Australian Terrier
Bedlington Terrier
Kerry Blue Terrier
Irish Terrier
Welsh Terrier
Skye Terrier
Norwich Terrier
Norfolk Terrier
Silky Terrier
Tibetan Terrier
Manchester Terrier
Russell Terrier
Parson Russell Terrier
Sealyham Terrier
Lakeland Terrier
Dandie Dinmont Terrier
Glen of Imaal Terrier
Miniature Bull Terrier
Toy Fox Terrier
Miniature Schnauzer
Black Russian Terrier`),
    angle('bouquet_flowers', 'style', 'everyday', 'Name a flower you\'d see in a bouquet.', `
1 Rose|Roses
1 Tulip|Tulips
1 Lily|Lilies
1 Daisy|Daisies
1 Sunflower|Sunflowers
1 Carnation|Carnations
2 Peony|Peonies
2 Orchid|Orchids
2 Hydrangea|Hydrangeas
2 Baby's breath
2 Chrysanthemum|Mum|Mums
2 Calla lily
2 Iris
2 Dahlia
2 Lavender
2 Daffodil|Daffodils
2 Lilac
2 Gerbera|Gerbera daisy
Ranunculus
Lisianthus
Freesia
Anemone
Alstroemeria|Peruvian lily
Gardenia
Snapdragon
Stock
Sweet pea
Magnolia
Gladiolus
Delphinium
Aster
Protea
Hyacinth
Camellia
Zinnia
Cosmos
Statice
Waxflower
Larkspur
Eucalyptus
Forget-me-not
Marigold
Poppy
Orange blossom
Stephanotis
Lily of the valley`),
    angle('designers', 'style', 'people', 'Name a fashion designer.', `
1 Coco Chanel|Chanel
1 Christian Dior|Dior
1 Giorgio Armani|Armani
1 Ralph Lauren
1 Calvin Klein
1 Versace|Gianni Versace|Donatella Versace
1 Michael Kors
1 Vera Wang
1 Gucci|Guccio Gucci
2 Tom Ford
2 Marc Jacobs
2 Donna Karan|DKNY
2 Diane von Furstenberg|DVF
2 Tommy Hilfiger
2 Valentino|Valentino Garavani
2 Yves Saint Laurent|YSL|Saint Laurent
2 Alexander McQueen|McQueen
2 Stella McCartney
2 Karl Lagerfeld
2 Oscar de la Renta
2 Carolina Herrera
2 Kate Spade
2 Betsey Johnson
2 Vivienne Westwood
2 Christian Louboutin|Louboutin
2 Manolo Blahnik|Manolo
2 Jimmy Choo
2 Prada|Miuccia Prada
2 Givenchy|Hubert de Givenchy
2 Tory Burch
Jean Paul Gaultier|Gaultier
Virgil Abloh
Isaac Mizrahi
Zac Posen
Christian Siriano
Kenzo
Dolce & Gabbana|Dolce and Gabbana|Domenico Dolce|Stefano Gabbana
Halston
Bill Blass
Anna Sui
Rei Kawakubo
Issey Miyake
Elsa Schiaparelli|Schiaparelli
Pierre Cardin
Thierry Mugler|Mugler
Phoebe Philo
Jason Wu
Prabal Gurung
Bob Mackie
Edith Head
Mary Quant
Sergio Hudson
Pharrell Williams`),
    angle('makeup', 'style', 'everyday', 'Name something in a makeup bag.', `
1 Lipstick
1 Mascara
1 Eyeliner
1 Foundation
1 Blush
1 Eyeshadow|Eye shadow
2 Concealer
2 Bronzer
2 Powder|Face powder|Setting powder
2 Lip gloss
2 Lip liner
2 Primer
2 Highlighter
2 Makeup brushes|Brushes|Brush
2 Sponge|Beauty blender|Makeup sponge
2 Tweezers
2 Eyelash curler|Lash curler
2 Lip balm|Chapstick
Setting spray
Contour
Brow pencil|Eyebrow pencil
False lashes|Fake eyelashes|Lashes
Nail polish
Tinted moisturizer
BB cream
CC cream
Lip stain
Brow gel
Color corrector
Makeup remover|Makeup wipes
Mirror|Compact
Bobby pins
Hair tie
Perfume
Moisturizer`),
    angle('shoes', 'style', 'category', 'Name a kind of shoe.', `
1 Sneakers|Sneaker|Tennis shoes
1 Heels|High heels
1 Boots|Boot
1 Sandals|Sandal
1 Flip-flops|Flip flops
1 Loafers|Loafer
1 Flats|Ballet flats
2 Pumps
2 Stilettos
2 Wedges
2 Clogs
2 Slippers
2 Mules
2 Oxfords
2 Moccasins
2 Cowboy boots
2 Rain boots|Wellies|Wellingtons|Galoshes
2 Crocs
2 Uggs
2 Slides
Espadrilles
Platforms
Combat boots
Hiking boots
Mary Janes
Kitten heels
Ankle boots|Booties
Chelsea boots
Boat shoes
Brogues
Cleats
Dress shoes
Slingbacks
Peep toes
Gladiator sandals
Huaraches
Birkenstocks
Jellies
Knee-high boots
Thigh-high boots
Snow boots
Tap shoes
Ballet slippers|Pointe shoes
Running shoes
High-tops
Wingtips
Derby shoes|Derbies
Monk straps
Desert boots
Moon boots`),
    angle('coffee_drinks', 'drink', 'category', 'Name a coffee drink.', `
1 Latte
1 Cappuccino
1 Espresso
1 Americano
1 Mocha
1 Iced coffee
2 Macchiato
2 Flat white
2 Cold brew
2 Frappuccino
2 Pumpkin spice latte|PSL
2 Black coffee|Drip coffee|Drip
Cortado
Affogato
Café au lait|Cafe au lait
Red eye
Irish coffee
Turkish coffee
Ristretto
Lungo
Doppio
Breve
Nitro cold brew|Nitro
Café con leche|Cafe con leche
Vietnamese iced coffee|Cà phê sữa đá
Café Cubano|Cuban coffee|Cafecito
Dalgona coffee|Dalgona
Pour-over|Pour over
Café de olla|Cafe de olla
Shakerato
Freddo espresso
Long black
Piccolo
Gibraltar
Frappé|Frappe
Espresso tonic`),
    angle('cocktails', 'drink', 'category', 'Name a cocktail.', `
1 Margarita
1 Martini
1 Mojito
1 Piña colada|Pina colada
1 Cosmopolitan|Cosmo
1 Bloody Mary
1 Old Fashioned
1 Mimosa
2 Manhattan
2 Daiquiri
2 Mai Tai
2 Moscow Mule
2 Negroni
2 Whiskey sour
2 Tom Collins
2 Bellini
2 Long Island iced tea
2 Sex on the Beach
2 Mint julep
2 Aperol spritz|Spritz
2 Tequila sunrise
2 White Russian
2 Screwdriver
2 Gin and tonic
2 Rum and Coke|Cuba libre
2 Espresso martini
2 Paloma
Gimlet
Sidecar
Sazerac
Hurricane
Dark 'n' Stormy|Dark and Stormy
Caipirinha
French 75
Lemon drop
Kamikaze
Mudslide
Grasshopper
Pisco sour
Amaretto sour
Bahama Mama
Zombie
Hot toddy
Sangria
Michelada
Appletini
Singapore Sling
Rob Roy
Boulevardier
Ranch water
Hugo spritz
Black Russian
Salty dog
Greyhound
Tom and Jerry
Vesper
Aviation
Last Word
Hanky Panky
Bee's Knees
Corpse Reviver`),
    angle('thanksgiving', 'holidays', 'time', 'Name a food on a Thanksgiving table.', `
1 Turkey
1 Stuffing|Dressing
1 Mashed potatoes
1 Gravy
1 Cranberry sauce
1 Pumpkin pie
2 Green bean casserole|Green beans
2 Sweet potatoes|Candied yams|Yams|Sweet potato casserole
2 Rolls|Dinner rolls
2 Corn
2 Cornbread
2 Mac and cheese|Macaroni and cheese
2 Pecan pie
2 Apple pie
2 Ham
Brussels sprouts
Deviled eggs
Collard greens
Salad
Squash
Biscuits
Corn casserole
Sweet potato pie
Cranberry relish
Butternut squash
Roasted vegetables
Pie
Wine
Ambrosia
Jell-O salad|Jello salad
Carrots
Mushrooms
Potatoes`),
    angle('wedding_things', 'holidays', 'everyday', 'Name something you\'d see at a wedding.', `
1 Bride
1 Groom
1 Wedding cake|Cake
1 Rings|Ring|Wedding rings
1 Flowers
1 Bouquet
1 Veil
1 Wedding dress|Dress|Gown
2 Tuxedo|Tux
2 Bridesmaids|Bridesmaid
2 Groomsmen|Groomsman
2 Flower girl
2 Ring bearer
2 Officiant|Priest|Minister|Rabbi|Pastor
2 DJ|Band
2 Champagne
2 First dance
2 Toast|Toasts
2 Vows
2 Photographer
Garter
Rice
Confetti
Limo|Limousine
Guest book
Favors
Centerpieces
Aisle
Arch
Candles
Dancing
Bubbles
Sparklers
Best man
Maid of honor
Bouquet toss
Programs
Seating chart
Open bar|Bar`),
    angle('snl', 'tv', 'people', 'Name a "Saturday Night Live" cast member.', `
1 Tina Fey
1 Amy Poehler
1 Will Ferrell
1 Eddie Murphy
1 Bill Murray
1 Adam Sandler
1 Chris Farley
1 Mike Myers
1 Kristen Wiig
1 Pete Davidson
1 Jimmy Fallon
2 Chevy Chase
2 John Belushi
2 Gilda Radner
2 Dan Aykroyd
2 Dana Carvey
2 Maya Rudolph
2 Kate McKinnon
2 Kenan Thompson
2 Andy Samberg
2 Bill Hader
2 Seth Meyers
2 Will Forte
2 Fred Armisen
2 Jason Sudeikis
2 Chris Rock
2 David Spade
2 Phil Hartman
2 Julia Louis-Dreyfus
2 Molly Shannon
2 Tracy Morgan
2 Bowen Yang
Cecily Strong
Aidy Bryant
Cheri Oteri
Ana Gasteyer
Rachel Dratch
Jan Hooks
Sarah Silverman
Larry David
Billy Crystal
Martin Short
Chris Kattan
Jay Pharoah
Leslie Jones
Sasheer Zamata
Ego Nwodim
Heidi Gardner
Chloe Fineman
Colin Jost
Michael Che
Sarah Sherman
Mikey Day
James Austin Johnson
Marcello Hernández|Marcello Hernandez
Chris Redd
Melissa Villaseñor|Melissa Villasenor
Jane Curtin
Laraine Newman
Garrett Morris
Joe Piscopo
Robert Downey Jr.|Robert Downey Jr
Ben Stiller
Damon Wayans
Norm Macdonald
Tim Meadows
Jim Breuer
Horatio Sanz
Darrell Hammond
Taran Killam
Bobby Moynihan
Vanessa Bayer
Nasim Pedrad
Jon Lovitz
Kevin Nealon
Rob Schneider
Chris Parnell`),
    angle('talk_hosts', 'tv', 'people', 'Name a talk show host.', `
1 Oprah Winfrey|Oprah
1 Ellen DeGeneres|Ellen
1 Jimmy Fallon
1 Jimmy Kimmel
1 Stephen Colbert
1 Conan O'Brien|Conan
1 Jay Leno
1 David Letterman|Letterman
1 Johnny Carson
1 Kelly Clarkson
2 Drew Barrymore
2 Seth Meyers
2 James Corden
2 Trevor Noah
2 Jon Stewart
2 Wendy Williams
2 Rosie O'Donnell
2 Kelly Ripa
2 Regis Philbin
2 Ryan Seacrest
2 Tamron Hall
2 Sherri Shepherd
2 Steve Harvey
2 Jerry Springer
2 Maury Povich|Maury
2 Dr. Phil|Phil McGraw
2 Whoopi Goldberg
2 Andy Cohen
2 Chelsea Handler
2 John Oliver
2 Bill Maher
2 Michael Strahan
2 Hoda Kotb
2 Martha Stewart
2 Rachael Ray
Phil Donahue
Montel Williams
Sally Jessy Raphael
Ricki Lake
Tyra Banks
Joy Behar
Arsenio Hall
Craig Ferguson
Merv Griffin
Dick Cavett
Graham Norton
Larry King
Mark Consuelos
Kathie Lee Gifford
Samantha Bee
Lilly Singh
Carson Daly
Tom Snyder
Meredith Vieira
Queen Latifah
Taylor Tomlinson
Jenny Jones
Geraldo Rivera|Geraldo
Mike Douglas
Dinah Shore
Jack Paar
Steve Allen
Chelsea Lately`),
    angle('chefs', 'food', 'people', 'Name a famous chef.', `
1 Gordon Ramsay
1 Julia Child
1 Bobby Flay
1 Rachael Ray
1 Ina Garten
1 Emeril Lagasse|Emeril
1 Guy Fieri
1 Anthony Bourdain
1 Wolfgang Puck
1 Martha Stewart
2 Jamie Oliver
2 Paula Deen
2 Giada De Laurentiis|Giada
2 Alton Brown
2 José Andrés|Jose Andres
2 Ree Drummond|The Pioneer Woman|Pioneer Woman
2 Nigella Lawson
2 Padma Lakshmi
2 Mario Batali
2 Tom Colicchio
2 Paul Hollywood
2 Mary Berry
2 Duff Goldman
2 Buddy Valastro
2 Masaharu Morimoto|Morimoto
Thomas Keller
Marcus Samuelsson
Ayesha Curry
Sandra Lee
Daniel Boulud
Alice Waters
David Chang
Jacques Pépin|Jacques Pepin
Nobu Matsuhisa|Nobu
Samin Nosrat
Carla Hall
Curtis Stone
Sunny Anderson
Michael Symon
Christina Tosi
Eric Ripert
Dominique Ansel
Antoni Porowski
Paul Prudhomme
James Beard
Graham Kerr
Justin Wilson
Jeff Smith
Ming Tsai
Rick Bayless
Ainsley Harriott
Delia Smith
Nadiya Hussain
Edna Lewis
Leah Chase
`),
    angle('stephen_king', 'books', 'category', 'Name a Stephen King book.', `
1 It
1 The Shining
1 Carrie
1 Misery
1 Pet Sematary
2 The Stand
2 Cujo
2 Christine
2 The Green Mile
2 'Salem's Lot|Salems Lot
2 Firestarter
2 The Dead Zone
2 11/22/63
2 Doctor Sleep
2 Under the Dome
2 Dolores Claiborne
2 Gerald's Game
2 Needful Things
2 The Running Man
2 The Long Walk
2 Thinner
2 The Outsider
2 The Dark Tower
Cycle of the Werewolf
The Talisman
The Eyes of the Dragon
The Tommyknockers
The Dark Half
Insomnia
Rose Madder
Desperation
Bag of Bones
The Girl Who Loved Tom Gordon
Dreamcatcher
Black House
From a Buick 8
Cell
Lisey's Story
Duma Key
Joyland
Mr. Mercedes|Mr Mercedes
Revival
Finders Keepers
End of Watch
Gwendy's Button Box
Sleeping Beauties
Elevation
The Institute
Later
Billy Summers
Fairy Tale
Holly
Never Flinch
The Gunslinger
The Drawing of the Three
The Waste Lands
Wizard and Glass
Wolves of the Calla
Song of Susannah
The Wind Through the Keyhole
Rage
Roadwork
The Regulators
Blaze
The Colorado Kid
Different Seasons
Night Shift
Skeleton Crew
Four Past Midnight
Danse Macabre
On Writing`),
    angle('austen_characters', 'books', 'people', 'Name a Jane Austen character.', `
1 Elizabeth Bennet|Lizzy Bennet|Elizabeth|Lizzy
1 Mr. Darcy|Darcy|Fitzwilliam Darcy|Mr Darcy
1 Emma Woodhouse|Emma
1 Jane Bennet
2 Mr. Knightley|Knightley|Mr Knightley
2 Mr. Bingley|Bingley|Charles Bingley|Mr Bingley
2 Mr. Collins|Mr Collins
2 Lydia Bennet|Lydia
2 Mr. Wickham|Wickham|George Wickham
2 Lady Catherine de Bourgh|Lady Catherine
2 Elinor Dashwood|Elinor
2 Marianne Dashwood|Marianne
2 Colonel Brandon|Brandon
2 Mrs. Bennet|Mrs Bennet
2 Mr. Bennet|Mr Bennet
Willoughby|John Willoughby
Edward Ferrars
Anne Elliot
Captain Wentworth|Frederick Wentworth|Wentworth
Fanny Price
Edmund Bertram
Catherine Morland
Henry Tilney
Harriet Smith
Charlotte Lucas
Frank Churchill
Mr. Elton|Mr Elton
Miss Bates
Isabella Thorpe
Mary Crawford
Henry Crawford
Georgiana Darcy
Caroline Bingley
Kitty Bennet
Mary Bennet
Jane Fairfax
Lucy Steele
Mrs. Jennings|Mrs Jennings
Sir Walter Elliot`),
    angle('potter_characters', 'books', 'people', 'Name a character in the "Harry Potter" books.', `
1 Hermione Granger|Hermione
1 Ron Weasley|Ron
1 Albus Dumbledore|Dumbledore
1 Severus Snape|Snape
1 Lord Voldemort|Voldemort|Tom Riddle|You-Know-Who
1 Draco Malfoy|Draco|Malfoy
1 Rubeus Hagrid|Hagrid
2 Sirius Black|Sirius
2 Remus Lupin|Lupin
2 Ginny Weasley|Ginny
2 Fred Weasley|Fred
2 George Weasley|George
2 Neville Longbottom|Neville
2 Luna Lovegood|Luna
2 Minerva McGonagall|McGonagall|Professor McGonagall
2 Dobby
2 Bellatrix Lestrange|Bellatrix
2 Lucius Malfoy|Lucius
2 Dolores Umbridge|Umbridge
2 Cedric Diggory|Cedric
2 Hedwig
2 Molly Weasley|Mrs. Weasley
2 Arthur Weasley|Mr. Weasley
2 Dudley Dursley|Dudley
2 Vernon Dursley|Uncle Vernon
2 Petunia Dursley|Aunt Petunia
Cho Chang
Percy Weasley|Percy
Bill Weasley
Charlie Weasley
Peter Pettigrew|Wormtail
Gilderoy Lockhart|Lockhart
Mad-Eye Moody|Alastor Moody|Moody
Nymphadora Tonks|Tonks
Kingsley Shacklebolt
Argus Filch|Filch
Crookshanks
Fawkes
Kreacher
Lily Potter
James Potter
Viktor Krum|Krum
Fleur Delacour|Fleur
Seamus Finnigan|Seamus
Dean Thomas
Lavender Brown
Oliver Wood
Moaning Myrtle|Myrtle
Nearly Headless Nick
Peeves
Quirinus Quirrell|Professor Quirrell|Quirrell
Horace Slughorn|Slughorn
Sybill Trelawney|Trelawney
Pomona Sprout|Professor Sprout
Filius Flitwick|Flitwick
Cornelius Fudge|Fudge
Rita Skeeter
Aberforth Dumbledore
Gellert Grindelwald|Grindelwald
Nagini
Buckbeak
Griphook
Garrick Ollivander|Ollivander
Vincent Crabbe|Crabbe
Gregory Goyle|Goyle
Fenrir Greyback
Barty Crouch Jr.|Barty Crouch
Scabbers
Fluffy
Hannah Abbott
Ernie Macmillan
Colin Creevey
Bathilda Bagshot
Xenophilius Lovegood
Narcissa Malfoy`),
    angle('award_shows', 'awards', 'category', 'Name an awards show.', `
1 Oscars|Academy Awards|The Oscars
1 Grammys|Grammy Awards
1 Emmys|Emmy Awards
1 Golden Globes|Golden Globe Awards
1 Tonys|Tony Awards
2 MTV Video Music Awards|VMAs|VMA
2 American Music Awards|AMAs
2 Billboard Music Awards
2 People's Choice Awards
2 Kids' Choice Awards|Kids Choice Awards
2 BAFTAs|BAFTA Awards
2 CMA Awards|Country Music Association Awards|CMAs
2 BET Awards
2 Screen Actors Guild Awards|SAG Awards|Actor Awards
2 Critics' Choice Awards|Critics Choice Awards
2 ESPYs|ESPY Awards
2 Daytime Emmys
2 Teen Choice Awards
2 Razzies|Golden Raspberry Awards
ACM Awards|Academy of Country Music Awards
Independent Spirit Awards|Spirit Awards
iHeartRadio Music Awards
NAACP Image Awards|Image Awards
Brit Awards|Brits
Juno Awards
Latin Grammys
Soul Train Awards
Webby Awards|Webbys
Peabody Awards|Peabodys
Gotham Awards
Obie Awards
Billboard Latin Music Awards
CMT Music Awards
Streamy Awards
Game Awards|The Game Awards
Primetime Emmys`),
    angle('oscar_hosts', 'awards', 'people', 'Name someone who has hosted the Oscars.', `
1 Billy Crystal
1 Bob Hope
1 Whoopi Goldberg
1 Ellen DeGeneres
1 Jimmy Kimmel
1 Chris Rock
2 Johnny Carson
2 Jon Stewart
2 Hugh Jackman
2 Steve Martin
2 Conan O'Brien
2 David Letterman
2 Anne Hathaway
2 James Franco
2 Seth MacFarlane
2 Neil Patrick Harris
2 Alec Baldwin
2 Amy Schumer
2 Wanda Sykes
2 Regina Hall
Jack Lemmon
Frank Sinatra
Jerry Lewis
David Niven
Richard Pryor
Paul Hogan
Chevy Chase
Goldie Hawn
Diana Ross
Jane Fonda
Walter Matthau
Dean Martin
Burt Reynolds
Warren Beatty
Shirley MacLaine
Michael Caine
Sammy Davis Jr.
Will Rogers
Rosalind Russell
Fred Astaire
Charlton Heston
Gene Kelly
Danny Kaye`),
    angle('racket_sports', 'sports', 'trait', 'Name a sport played with a racket or paddle.', `
1 Tennis
1 Ping-pong|Table tennis|Ping pong
1 Badminton
1 Pickleball
2 Squash
2 Racquetball
2 Padel
Platform tennis|Paddle tennis
Beach tennis
Real tennis|Court tennis
Racquets|Rackets
Lacrosse
Jai alai
Frontenis
Speedminton
Pelota`),
    angle('winter_olympics', 'sports', 'category', 'Name a Winter Olympics sport.', `
1 Figure skating|Skating
1 Ice hockey|Hockey
1 Skiing|Alpine skiing|Downhill skiing
1 Snowboarding
1 Speed skating
1 Bobsled|Bobsleigh
2 Curling
2 Luge
2 Ski jumping
2 Cross-country skiing|Cross country skiing
2 Biathlon
2 Skeleton
2 Short track|Short track speed skating
2 Freestyle skiing|Moguls|Aerials
Nordic combined
Ski mountaineering|Skimo
Ice dancing|Ice dance`),
    angle('tennis_players', 'sports', 'people', 'Name a famous tennis player.', `
1 Serena Williams|Serena
1 Venus Williams|Venus
1 Roger Federer|Federer
1 Rafael Nadal|Nadal|Rafa Nadal|Rafa
1 Novak Djokovic|Djokovic
1 Billie Jean King
1 Andre Agassi|Agassi
1 John McEnroe|McEnroe
2 Steffi Graf
2 Martina Navratilova|Navratilova
2 Chris Evert
2 Pete Sampras|Sampras
2 Jimmy Connors|Connors
2 Björn Borg|Bjorn Borg|Borg
2 Arthur Ashe
2 Monica Seles
2 Maria Sharapova|Sharapova
2 Naomi Osaka
2 Coco Gauff
2 Carlos Alcaraz|Alcaraz
2 Jannik Sinner|Sinner
2 Andy Murray
2 Anna Kournikova
2 Andy Roddick
Iga Świątek|Iga Swiatek|Swiatek
Aryna Sabalenka|Sabalenka
Martina Hingis
Justine Henin
Kim Clijsters
Lindsay Davenport
Jennifer Capriati
Rod Laver
Boris Becker
Ivan Lendl
Stefan Edberg
Althea Gibson
Margaret Court
Evonne Goolagong
Ashleigh Barty
Emma Raducanu
Taylor Fritz
Frances Tiafoe
Ben Shelton
Madison Keys
Sloane Stephens
Gabriela Sabatini
Arantxa Sánchez Vicario|Arantxa Sanchez Vicario
Elena Rybakina
Jessica Pegula
Daniil Medvedev
Alexander Zverev
Stan Wawrinka
Michael Chang
Jim Courier
Mary Pierce
Amélie Mauresmo|Amelie Mauresmo
Li Na
Victoria Azarenka
Caroline Wozniacki
Petra Kvitová|Petra Kvitova`),
    angle('gymnasts', 'sports', 'people', 'Name a famous gymnast.', `
1 Simone Biles
1 Nadia Comăneci|Nadia Comaneci|Nadia
1 Mary Lou Retton
1 Gabby Douglas
2 Aly Raisman
2 Shawn Johnson
2 Nastia Liukin
2 Kerri Strug
2 Dominique Dawes
2 Suni Lee|Sunisa Lee
2 Jordan Chiles
2 Olga Korbut
2 McKayla Maroney
Kohei Uchimura
Bart Conner
Shannon Miller
Carly Patterson
Paul Hamm
Jade Carey
Laurie Hernandez
Kyla Ross
Dominique Moceanu
Larisa Latynina
Rebeca Andrade
Hezly Rivera
Frederick Richard
Brody Malone
Stephen Nedoroscik
Svetlana Khorkina
Vera Čáslavská|Vera Caslavska
Kim Zmeskal
Alicia Sacramone
Kyle Shewfelt
Max Whitlock`),
    angle('ballets', 'stage', 'category', 'Name a ballet.', `
1 Swan Lake
1 The Nutcracker|Nutcracker
2 Sleeping Beauty|The Sleeping Beauty
2 Giselle
2 Romeo and Juliet
2 Cinderella
2 Don Quixote
Coppélia|Coppelia
La Bayadère|La Bayadere
The Firebird|Firebird
The Rite of Spring|Rite of Spring
Petrushka
La Sylphide
Le Corsaire
Raymonda
Paquita
Les Sylphides
Apollo
Jewels
Serenade
Spartacus
Onegin
Manon
Mayerling
Appalachian Spring
Rodeo
Fancy Free
Billy the Kid
Afternoon of a Faun|L'après-midi d'un faune
Boléro|Bolero
The Red Shoes
A Midsummer Night's Dream
Agon
Anastasia`),
    angle('disney_broadway', 'stage', 'crossover', 'Name a Disney movie that became a Broadway musical.', `
1 The Lion King|Lion King
1 Beauty and the Beast
1 Aladdin
1 The Little Mermaid|Little Mermaid
1 Frozen
1 Mary Poppins
2 Newsies
2 Tarzan
2 The Hunchback of Notre Dame|Hunchback of Notre Dame
Hercules
Freaky Friday`),
    angle('soaps', 'tv', 'category', 'Name a soap opera.', `
1 General Hospital
1 Days of Our Lives
1 The Young and the Restless|Young and the Restless
1 The Bold and the Beautiful|Bold and the Beautiful
1 All My Children
1 Dallas
1 Dynasty
2 One Life to Live
2 As the World Turns
2 Guiding Light
2 Knots Landing
2 Falcon Crest
2 Melrose Place
2 Passions
2 EastEnders
2 Coronation Street
2 Neighbours
2 Another World
2 Santa Barbara
2 Dark Shadows
2 Peyton Place
Search for Tomorrow
Ryan's Hope
Port Charles
Sunset Beach
The Edge of Night
The Doctors
Loving
Emmerdale
Hollyoaks
Home and Away
Beyond the Gates
Generations
The Colbys
Love of Life
The Secret Storm
Capitol`),
    angle('cartoon_dogs', 'kids', 'category', 'Name a cartoon dog.', `
1 Scooby-Doo|Scooby Doo|Scooby
1 Snoopy
1 Pluto
1 Goofy
1 Clifford
1 Odie
1 Bluey
2 Brian Griffin|Brian
2 Santa's Little Helper
2 Droopy
2 Astro
2 Blue
2 Bingo
2 Courage|Courage the Cowardly Dog
2 Lady
2 Tramp
2 Dug
2 Bolt
2 Gromit
2 Mr. Peabody|Mr Peabody
2 Scrappy-Doo|Scrappy Doo
2 Pongo
2 Underdog
Spike
Dogmatix
Ren
Jake
Krypto
Huckleberry Hound
Muttley
Perdita
Copper
Slinky Dog|Slinky
Porkchop
Deputy Dawg
McGruff
Chase
Marshall
Skye
Rubble
Rocky
Zuma
Max
`),
    angle('cartoon_cats', 'kids', 'category', 'Name a cartoon cat.', `
1 Garfield
1 Tom
1 Sylvester
1 Felix|Felix the Cat
1 Hello Kitty
1 The Cat in the Hat|Cat in the Hat
1 Puss in Boots|Puss
1 Cheshire Cat
2 Top Cat
2 Figaro
2 Lucifer
2 Duchess
2 Marie
2 Toulouse
2 Berlioz
2 Thomas O'Malley|O'Malley
2 Scratchy
2 Stimpy
2 Snowball
2 Salem
2 Pink Panther|The Pink Panther
2 Pete the Cat
2 Heathcliff
2 Azrael
2 Meowth
2 Gumball
Mittens
Mr. Jinks|Mr Jinks
Doraemon
Luna
Jiji
Catbus
Chococat
Sagwa
Nyan Cat
Grumpy Cat
Pete
Si and Am
Oliver
Rufus
Dinah
Sergeant Tibbs
Cat R. Waul`),
    angle('muppets', 'kids', 'category', 'Name a Muppet.', `
1 Kermit|Kermit the Frog
1 Miss Piggy
1 Fozzie|Fozzie Bear
1 Gonzo
1 Animal
1 Elmo
1 Cookie Monster
1 Big Bird
1 Oscar the Grouch|Oscar
1 Bert
1 Ernie
2 Rowlf
2 Scooter
2 Beaker
2 Dr. Bunsen Honeydew|Bunsen Honeydew|Bunsen
2 Swedish Chef|The Swedish Chef
2 Statler
2 Waldorf
2 Grover
2 Count von Count|The Count|Count
2 Snuffleupagus|Mr. Snuffleupagus|Snuffy
Sam Eagle
Rizzo
Pepe|Pepe the King Prawn
Janice
Dr. Teeth
Floyd
Sweetums
Camilla
Lew Zealand
Crazy Harry
Walter
Robin
Telly
Zoe
Abby Cadabby
Rosita
Herry Monster
Prairie Dawn
Guy Smiley
Two-Headed Monster
Julia
Baby Bear`),
    angle('fairy_tales', 'kids', 'category', 'Name a fairy tale.', `
1 Cinderella
1 Snow White
1 Sleeping Beauty
1 Little Red Riding Hood
1 Hansel and Gretel
1 Rapunzel
1 Jack and the Beanstalk
1 Goldilocks and the Three Bears|Goldilocks
1 The Three Little Pigs|Three Little Pigs
1 Beauty and the Beast
1 The Little Mermaid|Little Mermaid
2 Rumpelstiltskin
2 The Frog Prince|Frog Prince
2 The Princess and the Pea|Princess and the Pea
2 The Ugly Duckling|Ugly Duckling
2 Thumbelina
2 The Emperor's New Clothes|Emperor's New Clothes
2 The Snow Queen|Snow Queen
2 Puss in Boots
2 The Gingerbread Man|Gingerbread Man
2 The Elves and the Shoemaker
2 The Pied Piper of Hamelin|Pied Piper
2 Aladdin
2 Tom Thumb
The Twelve Dancing Princesses
Bluebeard
The Bremen Town Musicians
The Little Match Girl
The Goose Girl
Snow White and Rose Red
The Brave Little Tailor
The Steadfast Tin Soldier
The Golden Goose
Ali Baba and the Forty Thieves|Ali Baba
The Billy Goats Gruff|Three Billy Goats Gruff
Stone Soup
The Little Red Hen
Chicken Little|Henny Penny
East of the Sun and West of the Moon
The Wild Swans
The Six Swans`),
    angle('painters', 'art', 'people', 'Name a famous painter.', `
1 Leonardo da Vinci|Leonardo|Da Vinci
1 Pablo Picasso|Picasso
1 Vincent van Gogh|Van Gogh
1 Claude Monet|Monet
1 Michelangelo
1 Frida Kahlo|Frida
1 Salvador Dalí|Salvador Dali|Dali|Dalí
1 Andy Warhol|Warhol
1 Rembrandt
1 Bob Ross
2 Georgia O'Keeffe
2 Jackson Pollock|Pollock
2 Henri Matisse|Matisse
2 Edgar Degas|Degas
2 Pierre-Auguste Renoir|Renoir
2 Paul Cézanne|Cezanne|Cézanne
2 Gustav Klimt|Klimt
2 Edvard Munch|Munch
2 Johannes Vermeer|Vermeer
2 Raphael
2 Sandro Botticelli|Botticelli
2 Caravaggio
2 Francisco Goya|Goya
2 Diego Rivera
2 Mary Cassatt
2 Norman Rockwell
2 Jean-Michel Basquiat|Basquiat
2 Keith Haring
2 Roy Lichtenstein
2 Edward Hopper
2 Grandma Moses
Mark Rothko|Rothko
Wassily Kandinsky|Kandinsky
Paul Gauguin|Gauguin
Henri de Toulouse-Lautrec|Toulouse-Lautrec
Édouard Manet|Edouard Manet|Manet
Joan Miró|Joan Miro|Miró
René Magritte|Rene Magritte|Magritte
Marc Chagall|Chagall
Piet Mondrian|Mondrian
Jan van Eyck|Van Eyck
Hieronymus Bosch|Bosch
Pieter Bruegel|Bruegel|Brueghel
Diego Velázquez|Diego Velazquez|Velázquez
El Greco
Titian
J. M. W. Turner|Turner|JMW Turner
John Constable|Constable
Winslow Homer
James McNeill Whistler|Whistler
John Singer Sargent|Sargent
Grant Wood
Andrew Wyeth
Thomas Kinkade
Yayoi Kusama
Kehinde Wiley
Amy Sherald
David Hockney|Hockney
Banksy
Artemisia Gentileschi
Berthe Morisot
Camille Pissarro|Pissarro
Georges Seurat|Seurat
Paul Klee|Klee
Egon Schiele
Lee Krasner
Helen Frankenthaler`),
    angle('paintings', 'art', 'category', 'Name a famous painting.', `
1 Mona Lisa|The Mona Lisa
1 The Starry Night|Starry Night
1 The Last Supper|Last Supper
1 The Scream
1 Girl with a Pearl Earring
1 American Gothic
2 The Persistence of Memory|Persistence of Memory
2 The Birth of Venus|Birth of Venus
2 The Night Watch
2 Guernica
2 Water Lilies
2 The Kiss
2 Sunflowers
2 Whistler's Mother
2 The Creation of Adam|Creation of Adam
2 Nighthawks
2 The Great Wave off Kanagawa|The Great Wave|Great Wave
2 Campbell's Soup Cans
2 Washington Crossing the Delaware
2 Dogs Playing Poker
Las Meninas
A Sunday on La Grande Jatte|A Sunday Afternoon on the Island of La Grande Jatte|La Grande Jatte
Christina's World
Liberty Leading the People
The Garden of Earthly Delights
The School of Athens
The Arnolfini Portrait
Impression, Sunrise|Impression Sunrise
The Son of Man|Son of Man
The Two Fridas
The Hay Wain
Luncheon of the Boating Party
Café Terrace at Night|Cafe Terrace at Night
Bedroom in Arles
Wanderer above the Sea of Fog
Marilyn Diptych
Olympia
Le Déjeuner sur l'herbe|Luncheon on the Grass
The Swing
The Third of May 1808
Saturn Devouring His Son
Ophelia
The Lady of Shalott
Flaming June
Self-Portrait with Thorn Necklace and Hummingbird
Irises
Almond Blossoms
The Potato Eaters
Bal du moulin de la Galette`),
    angle('nobel_categories', 'awards', 'category', 'Name a Nobel Prize category.', `
1 Peace
1 Literature
1 Physics
1 Chemistry
2 Medicine|Physiology or Medicine|Physiology
2 Economics|Economic Sciences|Economic science`),
    angle('military_branches', 'history', 'category', 'Name a branch of the U.S. military.', `
1 Army
1 Navy
1 Air Force
1 Marines|Marine Corps|Marine
2 Coast Guard
2 Space Force`),
    angle('national_parks', 'geo', 'place', 'Name a U.S. national park.', `
1 Yellowstone
1 Yosemite
1 Grand Canyon
1 Zion
1 Great Smoky Mountains|Smoky Mountains|Smokies
1 Everglades
2 Glacier
2 Grand Teton|Tetons
2 Rocky Mountain
2 Acadia
2 Arches
2 Bryce Canyon|Bryce
2 Joshua Tree
2 Death Valley
2 Denali
2 Olympic
2 Mount Rainier
2 Sequoia
2 Badlands
2 Shenandoah
2 Mammoth Cave
2 Crater Lake
2 Redwood|Redwoods
2 Hot Springs
2 Carlsbad Caverns
2 Big Bend
2 Hawaiʻi Volcanoes|Hawaii Volcanoes
2 Haleakalā|Haleakala
2 Saguaro
2 Petrified Forest
2 Gateway Arch
Biscayne
Black Canyon of the Gunnison
Canyonlands
Capitol Reef
Channel Islands
Congaree
Cuyahoga Valley
Dry Tortugas
Gates of the Arctic
Glacier Bay
Great Basin
Great Sand Dunes
Guadalupe Mountains
Indiana Dunes
Isle Royale
Katmai
Kenai Fjords
Kings Canyon
Kobuk Valley
Lake Clark
Lassen Volcanic
Mesa Verde
New River Gorge
North Cascades
Pinnacles
Theodore Roosevelt
Virgin Islands
Voyageurs
White Sands
Wind Cave
Wrangell–St. Elias|Wrangell-St. Elias|Wrangell St Elias
American Samoa`),
    angle('paris_sights', 'geo', 'place', 'Name a famous sight in Paris.', `
1 Eiffel Tower
1 Louvre|The Louvre
1 Notre-Dame|Notre Dame|Notre-Dame Cathedral
1 Arc de Triomphe
1 Champs-Élysées|Champs-Elysees|Champs Elysees
2 Sacré-Cœur|Sacre-Coeur|Sacre Coeur
2 Montmartre
2 Seine|The Seine|River Seine
2 Musée d'Orsay|Musee d'Orsay|Orsay
2 Moulin Rouge
2 Versailles|Palace of Versailles
Pont Neuf
Panthéon|Pantheon
Luxembourg Gardens|Jardin du Luxembourg
Tuileries|Tuileries Garden
Place de la Concorde
Centre Pompidou|Pompidou Center|Pompidou
Les Invalides|Invalides
Opéra Garnier|Palais Garnier|Paris Opera
Catacombs|Catacombs of Paris
Père Lachaise|Pere Lachaise
Sainte-Chapelle|Sainte Chapelle
Pont Alexandre III
Place des Vosges
Latin Quarter
Disneyland Paris
Galeries Lafayette
Shakespeare and Company
Musée Rodin|Rodin Museum
La Défense|La Defense
Bastille|Place de la Bastille
Trocadéro|Trocadero
Jardin des Plantes
Conciergerie
Love Lock Bridge|Pont des Arts`),
    angle('nyc_sights', 'geo', 'place', 'Name a famous sight in New York City.', `
1 Statue of Liberty
1 Empire State Building
1 Times Square
1 Central Park
1 Brooklyn Bridge
1 Rockefeller Center
2 Chrysler Building
2 One World Trade Center|Freedom Tower|World Trade Center
2 9/11 Memorial|National September 11 Memorial
2 Grand Central Terminal|Grand Central|Grand Central Station
2 Metropolitan Museum of Art|The Met|Met Museum
2 Museum of Modern Art|MoMA
2 Guggenheim|Guggenheim Museum
2 American Museum of Natural History|Natural History Museum
2 Broadway
2 Wall Street
2 Flatiron Building
2 High Line|The High Line
2 Madison Square Garden
2 Yankee Stadium
2 Coney Island
2 Ellis Island
2 Radio City Music Hall|Radio City
2 Fifth Avenue|5th Avenue
St. Patrick's Cathedral|St Patrick's Cathedral
Carnegie Hall
Lincoln Center
Washington Square Park
Bryant Park
Top of the Rock
Chelsea Market
Apollo Theater
Stonewall Inn
Hudson Yards|The Vessel|Vessel
United Nations Headquarters|UN Headquarters|United Nations
New York Public Library|Public Library
Charging Bull|Wall Street Bull
Oculus
Little Italy
Chinatown
Citi Field
Prospect Park
Barclays Center
Summit One Vanderbilt
Edge
Intrepid Museum
Staten Island Ferry
Tiffany & Co.|Tiffany's
Rockefeller Christmas tree`),
    angle('italian_cities', 'geo', 'place', 'Name a city in Italy.', `
1 Rome
1 Venice
1 Florence
1 Milan
1 Naples
2 Pisa
2 Turin
2 Bologna
2 Verona
2 Genoa
2 Palermo
2 Siena
2 Amalfi
2 Sorrento
2 Positano
2 Pompeii
2 Capri
2 Como
Bari
Catania
Trieste
Padua
Parma
Modena
Lucca
Assisi
Perugia
Cagliari
Brescia
Bergamo
Ravenna
Rimini
Messina
Taormina
San Gimignano
Lecce
Matera
Salerno
Ferrara
Mantua
Livorno
Ancona
Portofino
Orvieto
Cortona
Syracuse|Siracusa
Reggio Calabria
Trento
Bolzano
Udine
Urbino`),
    angle('caribbean', 'geo', 'place', 'Name a country in the Caribbean.', `
1 Jamaica
1 Cuba
1 Bahamas|The Bahamas
1 Dominican Republic
1 Haiti
2 Barbados
2 Trinidad and Tobago|Trinidad|Tobago
2 Saint Lucia|St. Lucia|St Lucia
2 Grenada
2 Antigua and Barbuda|Antigua
Dominica
Saint Kitts and Nevis|St. Kitts and Nevis|St Kitts
Saint Vincent and the Grenadines|St. Vincent|St Vincent`),
    angle('spanish_speaking', 'geo', 'crossover', 'Name a country where most people speak Spanish.', `
1 Spain
1 Mexico
1 Argentina
1 Colombia
1 Peru
1 Chile
1 Cuba
2 Venezuela
2 Ecuador
2 Guatemala
2 Bolivia
2 Dominican Republic
2 Honduras
2 Costa Rica
2 Panama
2 Uruguay
2 Paraguay
2 El Salvador
2 Nicaragua
Equatorial Guinea`),
    angle('french_speaking', 'geo', 'crossover', 'Name a country where French is an official language.', `
1 France
1 Canada
1 Belgium
1 Switzerland
2 Haiti
2 Monaco
2 Luxembourg
2 Senegal
2 Madagascar
Côte d'Ivoire|Ivory Coast|Cote d'Ivoire
Cameroon
Democratic Republic of the Congo|DR Congo|Congo-Kinshasa
Congo|Republic of the Congo|Congo-Brazzaville
Mali
Niger
Burkina Faso
Chad
Guinea
Benin
Togo
Gabon
Rwanda
Burundi
Djibouti
Comoros
Seychelles
Vanuatu
Central African Republic
Equatorial Guinea`),
    angle('drive_left', 'geo', 'trait', 'Name a country where people drive on the left.', `
1 United Kingdom|UK|England|Britain|Great Britain|Scotland|Wales
1 Australia
1 Japan
1 India
1 Ireland
1 New Zealand
2 South Africa
2 Jamaica
2 Bahamas|The Bahamas
2 Thailand
2 Singapore
2 Malaysia
2 Indonesia
2 Kenya
2 Pakistan
2 Hong Kong
Bangladesh
Sri Lanka
Uganda
Tanzania
Zimbabwe
Zambia
Mozambique
Botswana
Namibia
Lesotho
Eswatini|Swaziland
Malawi
Barbados
Trinidad and Tobago
Guyana
Suriname
Cyprus
Malta
Mauritius
Nepal
Bhutan
Brunei
Timor-Leste|East Timor
Papua New Guinea
Fiji
Samoa
Tonga
Solomon Islands
Kiribati
Tuvalu
Nauru
Maldives
Seychelles
Antigua and Barbuda
Dominica
Grenada
Saint Kitts and Nevis
Saint Lucia
Saint Vincent and the Grenadines`),
    angle('red_white_flags', 'geo', 'trait', 'Name a country whose flag is only red and white.', `
1 Canada
1 Japan
1 Switzerland
1 Poland
2 Denmark
2 Austria
2 Indonesia
2 Peru
2 Turkey
2 Monaco
2 Singapore
Latvia
Bahrain
Qatar
Tonga
Georgia
Tunisia`),
    angle('bridges', 'geo', 'place', 'Name a famous bridge.', `
1 Golden Gate Bridge|Golden Gate
1 Brooklyn Bridge
1 Tower Bridge
1 London Bridge
2 Sydney Harbour Bridge|Sydney Harbor Bridge
2 Ponte Vecchio
2 Rialto Bridge|Rialto
2 Bridge of Sighs
2 Charles Bridge
2 Pont Neuf
2 George Washington Bridge
2 Mackinac Bridge
2 Bay Bridge|San Francisco–Oakland Bay Bridge
2 Verrazzano-Narrows Bridge|Verrazzano Bridge|Verrazano Bridge
2 Seven Mile Bridge
2 Chesapeake Bay Bridge
Chain Bridge|Széchenyi Chain Bridge
Akashi Kaikyō Bridge|Akashi Kaikyo Bridge
Millau Viaduct
Øresund Bridge|Oresund Bridge
Forth Bridge
Stari Most
Pont du Gard
Rainbow Bridge
Sunshine Skyway|Sunshine Skyway Bridge
Royal Gorge Bridge
Tsing Ma Bridge
Ha'penny Bridge
Clifton Suspension Bridge
Manhattan Bridge
Williamsburg Bridge
Queensboro Bridge|59th Street Bridge
Lake Pontchartrain Causeway
Confederation Bridge
Capilano Suspension Bridge
Lions Gate Bridge
Pont Alexandre III
Tacoma Narrows Bridge
Ambassador Bridge
Natchez Trace Parkway Bridge
Hong Kong–Zhuhai–Macau Bridge`),
    angle('famous_ships', 'history', 'category', 'Name a famous ship.', `
1 Titanic|RMS Titanic
1 Mayflower
1 Santa María|Santa Maria
1 Niña|Nina
1 Pinta
2 Queen Mary|RMS Queen Mary
2 USS Constitution|Old Ironsides
2 USS Arizona|Arizona
2 Bismarck
2 Lusitania
2 Edmund Fitzgerald
2 Black Pearl
2 Endurance
2 HMS Bounty|Bounty
2 HMS Beagle|Beagle
2 Queen Elizabeth 2|QE2
2 Carpathia
2 Andrea Doria
2 USS Enterprise|Enterprise
2 Cutty Sark
HMS Victory|Victory
Mary Rose
Endeavour|HMS Endeavour
Golden Hind
USS Monitor|Monitor
Merrimack|CSS Virginia
Exxon Valdez
Britannic
Olympic
Queen Anne's Revenge
Pequod
Nautilus
USS Missouri
Yamato
Amistad
Kon-Tiki
Calypso
Ever Given
Costa Concordia
Vasa
Argo
Flying Dutchman
Queen Mary 2|QM2
Batavia
Hunley|H. L. Hunley
Essex
Bluenose`),
    angle('queens', 'history', 'people', 'Name a famous queen.', `
1 Elizabeth II|Queen Elizabeth II|Elizabeth the Second
1 Elizabeth I|Queen Elizabeth I|Elizabeth the First
1 Victoria|Queen Victoria
1 Cleopatra
1 Marie Antoinette
1 Mary, Queen of Scots|Mary Queen of Scots
2 Catherine the Great
2 Isabella I|Queen Isabella|Isabella of Castile
2 Nefertiti
2 Anne Boleyn
2 Catherine of Aragon
2 Mary I|Bloody Mary|Mary Tudor
2 Queen Anne|Anne
2 Boudica|Boadicea
2 Hatshepsut
2 Queen of Sheba|Sheba
2 Esther|Queen Esther
2 Camilla|Queen Camilla
2 Liliuokalani|Liliʻuokalani
2 Queen Latifah
2 Queen Charlotte|Charlotte
2 Elizabeth, the Queen Mother|Queen Mother
Rania|Queen Rania
Noor|Queen Noor
Margrethe II|Margrethe
Beatrix
Wilhelmina
Christina of Sweden
Eleanor of Aquitaine
Maria Theresa
Cixi|Empress Dowager Cixi
Nzinga|Queen Nzinga
Zenobia
Tamar
Mumtaz Mahal
Jezebel
Matilda|Empress Matilda
Máxima|Queen Maxima
Letizia|Queen Letizia
Silvia|Queen Silvia
Sirikit
Salote Tupou III
Ranavalona I`),
    angle('first_ladies', 'history', 'people', 'Name a U.S. first lady.', `
1 Michelle Obama
1 Jacqueline Kennedy|Jackie Kennedy|Jackie O|Jacqueline Kennedy Onassis|Jackie
1 Eleanor Roosevelt
1 Martha Washington
1 Hillary Clinton|Hillary Rodham Clinton
1 Nancy Reagan
1 Melania Trump
1 Laura Bush
1 Barbara Bush
1 Jill Biden
2 Abigail Adams
2 Dolley Madison
2 Mary Todd Lincoln
2 Betty Ford
2 Rosalynn Carter
2 Lady Bird Johnson
2 Pat Nixon
2 Mamie Eisenhower
2 Bess Truman
Edith Roosevelt
Edith Wilson
Ellen Wilson
Grace Coolidge
Lou Hoover
Florence Harding
Helen Taft
Ida McKinley
Frances Cleveland
Caroline Harrison
Lucretia Garfield
Lucy Hayes
Julia Grant
Eliza Johnson
Jane Pierce
Abigail Fillmore
Margaret Taylor
Sarah Polk
Letitia Tyler
Julia Tyler
Anna Harrison
Louisa Adams
Elizabeth Monroe
Mary Harrison McKee`),
    angle('suffragists', 'history', 'people', 'Name someone who fought for women\'s right to vote.', `
1 Susan B. Anthony|Susan B Anthony
1 Elizabeth Cady Stanton
2 Lucretia Mott
2 Alice Paul
2 Sojourner Truth
2 Ida B. Wells|Ida B Wells
2 Emmeline Pankhurst
2 Frederick Douglass
2 Carrie Chapman Catt
Lucy Stone
Julia Ward Howe
Mary Church Terrell
Inez Milholland
Lucy Burns
Matilda Joslyn Gage
Harriet Tubman
Victoria Woodhull
Millicent Fawcett
Emily Davison|Emily Wilding Davison
Christabel Pankhurst
Sylvia Pankhurst
Anna Howard Shaw
Frances Willard
Amelia Bloomer
Jeannette Rankin
Mabel Ping-Hua Lee
Zitkála-Šá|Zitkala-Sa
Frances Ellen Watkins Harper
Adelina Otero-Warren`),
    angle('scientists', 'science', 'people', 'Name a famous scientist.', `
1 Albert Einstein|Einstein
1 Isaac Newton|Newton
1 Marie Curie|Madame Curie
1 Charles Darwin|Darwin
1 Galileo|Galileo Galilei
1 Nikola Tesla|Tesla
1 Thomas Edison|Edison
1 Stephen Hawking|Hawking
2 Rosalind Franklin
2 Jane Goodall
2 Louis Pasteur|Pasteur
2 Neil deGrasse Tyson
2 Carl Sagan
2 Bill Nye
2 Ada Lovelace
2 Alan Turing
2 Gregor Mendel|Mendel
2 Johannes Kepler|Kepler
2 Nicolaus Copernicus|Copernicus
2 Michael Faraday|Faraday
2 Niels Bohr|Bohr
2 Richard Feynman|Feynman
2 Rachel Carson
2 Katherine Johnson
2 Jonas Salk
2 Alexander Fleming
2 Edwin Hubble|Hubble
2 Robert Oppenheimer|J. Robert Oppenheimer|Oppenheimer
2 Archimedes
2 Benjamin Franklin
2 George Washington Carver
2 Alexander Graham Bell
2 Sally Ride
James Clerk Maxwell
Max Planck
Dmitri Mendeleev|Mendeleev
Mae Jemison
Enrico Fermi
Pythagoras
Aristotle
Hippocrates
Barbara McClintock
Lise Meitner
Dorothy Hodgkin
Grace Hopper
Tim Berners-Lee
Jennifer Doudna
Francis Crick
James Watson
Erwin Schrödinger|Erwin Schrodinger|Schrödinger
Werner Heisenberg|Heisenberg
Antoine Lavoisier|Lavoisier
Edward Jenner
Emmy Noether
Chien-Shiung Wu
Jocelyn Bell Burnell
Hedy Lamarr
Florence Nightingale
Leonardo da Vinci
Robert Boyle
Henrietta Leavitt
Vera Rubin`),
    angle('astronauts', 'science', 'people', 'Name an astronaut.', `
1 Neil Armstrong
1 Buzz Aldrin
1 Sally Ride
1 John Glenn
2 Michael Collins
2 Alan Shepard
2 Yuri Gagarin
2 Valentina Tereshkova
2 Mae Jemison
2 Chris Hadfield
2 Scott Kelly
2 Mark Kelly
2 Jim Lovell
2 Christa McAuliffe
2 Suni Williams|Sunita Williams
2 Butch Wilmore
2 Christina Koch
Gus Grissom
Ed White
Roger Chaffee
Eileen Collins
Peggy Whitson
Jessica Meir
John Young
Gene Cernan
Pete Conrad
Alan Bean
Gordon Cooper
Scott Carpenter
Wally Schirra
Deke Slayton
Ellison Onizuka
Judith Resnik
Ronald McNair
Kalpana Chawla
Guion Bluford
Tim Peake
Samantha Cristoforetti
Reid Wiseman
Victor Glover
Jeremy Hansen
Jared Isaacman
Story Musgrave
Ellen Ochoa
Franklin Chang-Díaz|Franklin Chang-Diaz
Rusty Schweickart
Charlie Duke
Edgar Mitchell
Jack Swigert
Fred Haise
Harrison Schmitt
Dave Scott
Jim Irwin
Al Worden`),
    angle('dinosaurs', 'science', 'category', 'Name a dinosaur.', `
1 Tyrannosaurus rex|T. rex|T-Rex|T rex|Tyrannosaurus
1 Triceratops
1 Stegosaurus
1 Velociraptor|Raptor
1 Brachiosaurus
1 Brontosaurus
2 Apatosaurus
2 Diplodocus
2 Spinosaurus
2 Ankylosaurus
2 Parasaurolophus
2 Iguanodon
2 Allosaurus
2 Pachycephalosaurus
2 Dilophosaurus
Gallimimus
Compsognathus
Carnotaurus
Giganotosaurus
Argentinosaurus
Therizinosaurus
Oviraptor
Deinonychus
Archaeopteryx
Maiasaura
Protoceratops
Styracosaurus
Megalosaurus
Baryonyx
Troodon
Microraptor
Plateosaurus
Coelophysis
Edmontosaurus
Utahraptor
Corythosaurus
Albertosaurus
Ceratosaurus
Camarasaurus
Hadrosaurus
Psittacosaurus
Sauropelta`),
    angle('air_gases', 'science', 'trait', 'Name a gas in the air we breathe.', `
1 Oxygen
1 Nitrogen
1 Carbon dioxide|CO2
2 Argon
2 Water vapor|Water vapour|Steam
2 Helium
2 Hydrogen
2 Methane
2 Neon
2 Ozone
Krypton
Xenon
Nitrous oxide
Carbon monoxide
Radon
Sulfur dioxide`),
    angle('bones', 'science', 'category', 'Name a bone in the human body.', `
1 Femur|Thigh bone
1 Skull|Cranium
1 Rib|Ribs
1 Spine|Vertebrae|Vertebra|Backbone
1 Pelvis|Hip bone|Hip
1 Collarbone|Clavicle
1 Kneecap|Patella
2 Tibia|Shinbone|Shin bone
2 Fibula
2 Humerus|Funny bone
2 Radius
2 Ulna
2 Sternum|Breastbone
2 Shoulder blade|Scapula
2 Jawbone|Mandible|Jaw
2 Tailbone|Coccyx
2 Phalanges|Phalanx|Finger bones|Toe bones
Maxilla
Sacrum
Metacarpals|Metacarpal
Metatarsals|Metatarsal
Carpals|Carpal
Tarsals|Tarsal
Heel bone|Calcaneus
Talus|Ankle bone
Hyoid
Stapes|Stirrup
Incus|Anvil
Malleus|Hammer
Nasal bone
Cheekbone|Zygomatic bone|Zygomatic
Temporal bone
Parietal bone
Frontal bone
Occipital bone
Sphenoid
Ethmoid
Scaphoid
Atlas
Axis`),
    angle('organs', 'science', 'category', 'Name an organ in the human body.', `
1 Heart
1 Brain
1 Lungs|Lung
1 Liver
1 Kidneys|Kidney
1 Stomach
1 Skin
2 Pancreas
2 Spleen
2 Gallbladder
2 Intestines|Small intestine|Large intestine|Colon|Bowel
2 Bladder
2 Appendix
2 Esophagus
2 Thyroid
2 Eyes|Eye
2 Tongue
Uterus
Ovaries|Ovary
Prostate
Adrenal glands|Adrenal gland
Thymus
Larynx|Voice box
Trachea|Windpipe
Diaphragm
Tonsils|Tonsil
Pituitary gland|Pituitary
Ears|Ear
Nose
Testes|Testicles
Rectum
Duodenum
Pineal gland
Spinal cord`),
    angle('crayons', 'kids', 'everyday', 'Name a color in a box of crayons.', `
1 Red
1 Blue
1 Yellow
1 Green
1 Orange
1 Purple|Violet
1 Black
1 Brown
1 Pink
2 White
2 Gray|Grey
2 Magenta
2 Turquoise
2 Indigo
2 Periwinkle
2 Burnt Sienna
2 Raw Umber
2 Cerulean
2 Goldenrod
2 Maroon
2 Peach
2 Tan
2 Lavender
2 Aquamarine
2 Salmon
2 Scarlet
2 Sky Blue
2 Forest Green
2 Teal
2 Mahogany
2 Burnt Orange
2 Apricot
2 Silver
2 Gold
Copper
Mauve
Melon
Plum
Sepia
Navy Blue
Brick Red
Olive Green
Dandelion
Carnation Pink
Cornflower
Jungle Green
Macaroni and Cheese
Mango Tango
Razzmatazz
Tickle Me Pink
Timberwolf
Wild Watermelon
Purple Mountains' Majesty
Robin's Egg Blue
Granny Smith Apple
Bluetiful
Atomic Tangerine
Laser Lemon
Outer Space
Shocking Pink
Neon Carrot
Screamin' Green
Inchworm
Wisteria
Denim
Cadet Blue
Chestnut
Bittersweet
Thistle
Orchid`),
    angle('blue_shades', 'style', 'trait', 'Name a shade of blue.', `
1 Navy|Navy blue
1 Royal blue
1 Sky blue
1 Baby blue
1 Turquoise
1 Teal
2 Cobalt|Cobalt blue
2 Cerulean
2 Azure
2 Indigo
2 Sapphire
2 Periwinkle
2 Powder blue
2 Aqua
2 Cyan
2 Midnight blue
2 Electric blue
2 Denim
2 Tiffany blue
2 Robin's egg blue
Ultramarine
Steel blue
Cornflower|Cornflower blue
Slate blue
Prussian blue
Carolina blue
Ice blue
Peacock blue
Air Force blue
Columbia blue
Egyptian blue
Persian blue
Dodger blue
Duck egg blue
Klein blue|International Klein Blue
Oxford blue
Cambridge blue
Lapis|Lapis lazuli
Glaucous
Alice blue`),
    angle('nuts', 'food', 'category', 'Name a nut.', `
1 Peanut|Peanuts
1 Almond|Almonds
1 Cashew|Cashews
1 Walnut|Walnuts
1 Pecan|Pecans
1 Pistachio|Pistachios
2 Hazelnut|Hazelnuts|Filbert
2 Macadamia|Macadamia nut
2 Brazil nut|Brazil nuts
2 Pine nut|Pine nuts|Pignoli
2 Chestnut|Chestnuts
2 Coconut
Acorn
Hickory nut
Beechnut
Butternut
Kola nut
Candlenut
Tiger nut
Pili nut
Ginkgo nut
Betel nut`),
    angle('breads', 'food', 'category', 'Name a kind of bread.', `
1 White
1 Wheat|Whole wheat
1 Sourdough
1 Rye
1 Baguette
1 Bagel
1 Croissant
2 Pumpernickel
2 Brioche
2 Ciabatta
2 Focaccia
2 Challah
2 Naan
2 Pita
2 Tortilla
2 Cornbread
2 Banana bread
2 Biscuit|Biscuits
2 English muffin
2 Garlic bread
2 Rolls|Roll|Dinner roll
2 Multigrain
Soda bread|Irish soda bread
Zucchini bread
Monkey bread
Texas toast
Flatbread
Matzo|Matzah
Injera
Lavash
Chapati|Roti
Arepa
Pretzel
Hamburger bun|Bun
Hot dog bun
Kaiser roll
Hawaiian rolls|Hawaiian bread|King's Hawaiian
Potato bread
Raisin bread|Cinnamon raisin bread
Babka
Panettone
Stollen
Fry bread
Pan dulce|Concha
Bolillo
Pão de queijo|Pao de queijo
Hot cross bun
Crumpet
Scone
Paratha
Bao|Steamed bun
Pumpkin bread
Pull-apart bread`),
    angle('fast_food', 'food', 'category', 'Name a fast-food chain.', `
1 McDonald's|McDonalds
1 Burger King
1 Wendy's|Wendys
1 Taco Bell
1 KFC|Kentucky Fried Chicken
1 Subway
1 Chick-fil-A|Chick fil A|Chickfila
1 Popeyes
1 Arby's|Arbys
1 Domino's|Dominos
1 Pizza Hut
1 Dunkin'|Dunkin|Dunkin' Donuts|Dunkin Donuts
1 Starbucks
2 Sonic
2 Jack in the Box
2 Dairy Queen|DQ
2 In-N-Out|In-N-Out Burger|In N Out
2 Five Guys
2 Chipotle
2 Panda Express
2 Papa John's|Papa Johns
2 Little Caesars
2 Carl's Jr.|Carl's Jr|Carls Jr
2 Hardee's|Hardees
2 White Castle
2 Whataburger
2 Culver's|Culvers
2 Shake Shack
2 Raising Cane's|Raising Canes|Cane's
2 Wingstop
2 Jersey Mike's|Jersey Mikes
2 Jimmy John's|Jimmy Johns
2 Panera Bread|Panera
2 Krispy Kreme
2 Tim Hortons|Tim Horton's
Del Taco
Church's Chicken|Church's
Long John Silver's|Long John Silvers
Checkers|Rally's
Krystal
Bojangles
Zaxby's|Zaxbys
Firehouse Subs
Qdoba
El Pollo Loco
Steak 'n Shake|Steak n Shake
A&W
Captain D's
Moe's|Moe's Southwest Grill
Sbarro
Auntie Anne's
Cinnabon
Baskin-Robbins|Baskin Robbins
Dutch Bros
Jamba|Jamba Juice
Smoothie King
Crumbl
Freddy's
Portillo's
Cook Out
Waffle House
Torchy's Tacos
Taco John's
Wienerschnitzel
Quiznos
Potbelly
Noodles & Company|Noodles and Company
Blimpie
Hot Dog on a Stick
Pollo Tropical
Fatburger`),
    angle('cereals', 'food', 'category', 'Name a breakfast cereal.', `
1 Cheerios
1 Frosted Flakes
1 Corn Flakes
1 Lucky Charms
1 Froot Loops|Fruit Loops
1 Cinnamon Toast Crunch
1 Cap'n Crunch|Captain Crunch
1 Rice Krispies
1 Raisin Bran
1 Honey Nut Cheerios
2 Special K
2 Cocoa Puffs
2 Trix
2 Fruity Pebbles
2 Cocoa Pebbles
2 Honey Bunches of Oats
2 Frosted Mini-Wheats|Mini-Wheats|Mini Wheats
2 Apple Jacks
2 Corn Pops
2 Golden Grahams
2 Kix
2 Wheaties
2 Life
2 Chex|Rice Chex|Corn Chex|Wheat Chex
2 Grape-Nuts|Grape Nuts
2 Count Chocula
2 Cookie Crisp
2 Reese's Puffs
2 Honey Smacks|Smacks
2 Shredded Wheat
2 Fiber One
Franken Berry
Boo Berry
Cracklin' Oat Bran
Total
Kashi
Cocoa Krispies
Crispix
Honeycomb
Golden Crisp
Post Toasties
Krave
Oatmeal Squares
Basic 4
Peanut Butter Crunch
Crunch Berries
Alpha-Bits|Alpha Bits
Waffle Crisp
Puffins
Quisp
Product 19
Mueslix
Smart Start
Clusters
Great Grains`),
    angle('candy_bars', 'food', 'category', 'Name a candy bar.', `
1 Snickers
1 Kit Kat|KitKat
1 Twix
1 Milky Way
1 3 Musketeers|Three Musketeers
1 Butterfinger
1 Hershey's|Hershey bar|Hershey's bar|Hershey's Milk Chocolate
1 Reese's|Reese's Peanut Butter Cups|Reese's Cups
1 Almond Joy
2 Baby Ruth
2 Mounds
2 PayDay|Pay Day
2 Mr. Goodbar|Mr Goodbar
2 Crunch|Nestlé Crunch|Nestle Crunch
2 100 Grand|Hundred Grand
2 Heath|Heath bar
2 Skor
2 Whatchamacallit
2 Toblerone
2 Mars bar|Mars
2 Cadbury Dairy Milk|Dairy Milk|Cadbury
2 Kinder Bueno
2 Take 5
2 Caramello
2 Charleston Chew
Clark Bar|Clark
Zero|Zero bar
Oh Henry!|Oh Henry
Krackel
Symphony
Cookies 'n' Creme|Hershey's Cookies 'n' Creme
Aero
Wonka Bar
Big Hunk
Abba-Zaba|Abba Zaba
Chunky
Look!
Bounty
Twirl
Flake
Crunchie
Wispa
Lion bar
Milky Way Midnight
Snickers Almond
Fifth Avenue|5th Avenue
Salted Nut Roll
Idaho Spud
Cherry Mash
Goo Goo Cluster
Rolo`),
    angle('ice_cream', 'food', 'category', 'Name an ice cream flavor.', `
1 Vanilla
1 Chocolate
1 Strawberry
1 Mint chocolate chip|Mint chip|Mint
1 Cookies and cream|Cookies 'n' cream|Cookies n cream
1 Rocky road
1 Cookie dough|Chocolate chip cookie dough
1 Butter pecan
1 Neapolitan
2 Coffee
2 Pistachio
2 Chocolate chip
2 Rum raisin
2 Moose tracks
2 Birthday cake|Cake batter
2 Salted caramel|Caramel
2 Cherry|Black cherry|Cherry Garcia
2 Peach
2 Coconut
2 Mango
2 Green tea|Matcha
2 French vanilla
2 Peanut butter|Peanut butter cup
2 Cotton candy
2 Bubble gum
2 Spumoni
2 Banana
2 Raspberry
2 Rainbow sherbet|Sherbet
2 Pralines and cream|Praline
2 Butterscotch
2 Chunky Monkey
2 Phish Food
2 S'mores
2 Fudge ripple|Chocolate fudge|Fudge
Tutti frutti
Lemon
Dulce de leche
Maple walnut
Cinnamon
Ube
Brownie batter
Cookie Monster
Superman
Black walnut
Pumpkin
Eggnog
Tiramisu
Red velvet
Honey lavender
Blueberry
Toasted almond
Lemon custard
Coffee Heath bar crunch
Half Baked`),
    angle('sodas', 'drink', 'category', 'Name a soda.', `
1 Coca-Cola|Coke|Coca Cola
1 Pepsi
1 Sprite
1 Dr Pepper|Dr. Pepper
1 Mountain Dew|Mtn Dew
1 7 Up|7UP|Seven Up
1 Fanta
1 Root beer|A&W|Barq's|Mug
1 Ginger ale|Canada Dry
1 Diet Coke
2 Coke Zero|Coca-Cola Zero
2 Diet Pepsi
2 Sunkist
2 Crush|Orange Crush
2 Cream soda
2 Big Red
2 Squirt
2 Fresca
2 Sierra Mist|Starry
2 RC Cola|Royal Crown
2 Cheerwine
2 Mello Yello
2 Vernors
2 Tab
2 Jarritos
2 Pibb Xtra|Mr. Pibb|Mr Pibb
2 Faygo
2 Shasta
2 Olipop
2 Poppi
Surge
Inca Kola
Dr. Brown's|Dr Brown's
Tonic water|Tonic
Club soda|Seltzer|Sparkling water
Sun Drop
Moxie
Irn-Bru|Irn Bru
Schweppes
Sprecher
Jones Soda
Grape soda|Grape Crush|Nehi
Orange soda
Birch beer
Cel-Ray
Kickstart
Pepsi Zero Sugar
Diet Dr Pepper
Coca-Cola Cherry|Cherry Coke
Vanilla Coke
Pepsi Wild Cherry`),
    angle('teas', 'drink', 'category', 'Name a kind of tea.', `
1 Green
1 Black
1 Chamomile
1 Earl Grey
1 Iced tea
1 Sweet tea
1 Peppermint|Mint
2 English Breakfast
2 Oolong
2 White
2 Chai|Masala chai
2 Matcha
2 Jasmine
2 Hibiscus
2 Bubble tea|Boba|Boba tea
2 Rooibos|Red bush
2 Lemon|Lemon ginger
2 Ginger
2 Darjeeling
2 Herbal
Assam
Pu-erh|Puerh
Lapsang souchong
Sencha
Genmaicha
Hojicha
Yerba mate|Mate
Irish Breakfast
Ceylon
Lady Grey
Thai tea|Thai iced tea
Milk tea
Echinacea
Barley tea
Arnold Palmer
Hong Kong milk tea
Kombucha
Gunpowder
Lemongrass
Rose
Lavender
Tulsi`),
    angle('social_apps', 'tech', 'category', 'Name a social media app.', `
1 Facebook
1 Instagram
1 TikTok
1 X|Twitter
1 Snapchat
1 YouTube
2 LinkedIn
2 Pinterest
2 Reddit
2 WhatsApp
2 Threads
2 Bluesky
2 Tumblr
2 Discord
2 BeReal
2 Twitch
2 Telegram
2 MySpace
2 Vine
2 Nextdoor
WeChat
Mastodon
Clubhouse
Weibo
Truth Social
Lemon8
Flickr
Quora
Strava
Letterboxd
Goodreads
Substack
Signal
Friendster
Xanga
LiveJournal
Google+|Google Plus
Periscope
Musical.ly
Yik Yak
Line
Kakao
VK
Douyin
Xiaohongshu|RedNote`),
    angle('dating_apps', 'tech', 'category', 'Name a dating app.', `
1 Tinder
1 Bumble
1 Hinge
2 Match|Match.com
2 OkCupid
2 eHarmony
2 Grindr
2 Coffee Meets Bagel
2 Plenty of Fish|POF
2 Raya
2 The League
2 Facebook Dating
Her
Feeld
Christian Mingle
JDate
Zoosk
Happn
Badoo
EliteSingles|Elite Singles
Farmers Only
OurTime
Lex
Thursday
Boo
Muzz
Taimi
Archer`),
    angle('wall_plugs', 'home', 'everyday', 'Name something you plug into a wall.', `
1 Lamp
1 Toaster
1 TV|Television
1 Phone charger|Charger
1 Microwave
1 Refrigerator|Fridge
1 Vacuum|Vacuum cleaner
1 Hair dryer|Blow dryer
2 Iron
2 Blender
2 Coffee maker|Coffee pot|Keurig
2 Computer|Laptop
2 Fan
2 Space heater|Heater
2 Washing machine|Washer
2 Dryer
2 Air conditioner|AC
2 Curling iron
2 Straightener|Flat iron
2 Night light|Nightlight
2 Kettle|Electric kettle
2 Slow cooker|Crock-Pot|Crockpot
2 Air fryer
2 Printer
2 Alarm clock|Clock
2 Christmas lights
2 Router|Wi-Fi router|Modem
Dishwasher
Stand mixer|Mixer|KitchenAid
Electric toothbrush
Humidifier
Radio
Game console|Xbox|PlayStation|Nintendo
Stove|Oven
Instant Pot
Dehumidifier
Lava lamp
Fish tank|Aquarium
Electric blanket|Heating pad
Shaver|Electric razor
Speaker
Sewing machine
Food processor
Rice cooker
Waffle maker
Toaster oven
Garbage disposal
Freezer
Treadmill`),
    angle('house_rooms', 'home', 'everyday', 'Name a room in a house.', `
1 Kitchen
1 Bedroom
1 Bathroom
1 Living room
1 Dining room
1 Basement
1 Attic
1 Garage
2 Laundry room
2 Family room|Den
2 Office|Home office|Study
2 Closet
2 Pantry
2 Hallway|Hall
2 Foyer|Entryway
2 Mudroom
2 Guest room
2 Nursery
2 Playroom
2 Sunroom
2 Master bedroom|Primary bedroom
Library
Game room
Media room|Home theater
Gym|Home gym
Loft
Powder room
Utility room
Cellar|Wine cellar
Parlor
Walk-in closet
Craft room
Workshop
Bonus room
Great room
Breakfast nook
Conservatory
Rec room
Panic room
Sitting room
Butler's pantry
Linen closet`),
    angle('first_aid', 'home', 'everyday', 'Name something in a first aid kit.', `
1 Bandages|Band-Aids|Band-Aid|Bandage
1 Gauze
1 Tape|Medical tape
1 Antiseptic wipes|Alcohol wipes|Alcohol
1 Antibiotic ointment|Neosporin
1 Tweezers
1 Scissors
2 Gloves
2 Thermometer
2 Ice pack|Cold pack
2 Pain reliever|Aspirin|Ibuprofen|Tylenol|Advil
2 Cotton balls
2 Hydrogen peroxide|Peroxide
2 Ace bandage|Elastic bandage
2 Hand sanitizer
2 Burn cream
2 Hydrocortisone
2 Calamine lotion|Calamine
2 Safety pins
CPR mask
Splint
Eye wash
Sling|Triangular bandage
Benadryl|Antihistamine
Moleskin
Butterfly bandages
Cotton swabs|Q-tips
Instant cold pack
Emergency blanket
Whistle
Flashlight
Tourniquet
EpiPen
Saline`),
    angle('car_parts', 'home', 'category', 'Name a part of a car.', `
1 Engine
1 Tires|Tire|Wheels|Wheel
1 Steering wheel
1 Brakes
1 Battery
1 Windshield
1 Seat belt|Seatbelt
1 Trunk
1 Hood
2 Bumper
2 Headlights|Headlight
2 Taillights|Taillight
2 Mirror|Rearview mirror|Side mirror
2 Muffler
2 Exhaust|Exhaust pipe|Tailpipe
2 Transmission
2 Radiator
2 Gas tank|Fuel tank
2 Doors|Door
2 Windows|Window
2 Windshield wipers|Wipers
2 Horn
2 Dashboard
2 Glove box|Glove compartment
2 Seats|Seat
2 Spark plugs
2 Alternator
2 Airbag|Airbags
2 Gas pedal|Accelerator
2 Spare tire
2 Speedometer
2 License plate
Axle
Gearshift|Shifter|Gear stick|Stick shift
Clutch
Brake pedal
Hubcap|Hubcaps
Grille
Fender
Odometer
Sunroof
Carburetor
Suspension
Shocks|Shock absorbers
Struts
Catalytic converter
Fan belt|Serpentine belt
Oil filter
Air filter
Antenna
Cup holder
Ignition
Turn signal|Blinker
Steering column
Cruise control
Rims
Radio`),
    angle('famous_horses', 'nature', 'people', 'Name a famous horse.', `
1 Secretariat
1 Seabiscuit
1 Mister Ed|Mr. Ed|Mr Ed
1 Black Beauty
1 Trigger
1 Silver
2 Man o' War
2 Seattle Slew
2 Affirmed
2 American Pharoah
2 Justify
2 War Admiral
2 Citation
2 Barbaro
2 Spirit
2 Pegasus
2 Shadowfax
2 Maximus
2 Bullseye
2 The Black Stallion|Black Stallion
2 Flicka|My Friend Flicka
2 Joey
Whirlaway
Funny Cide
Smarty Jones
Rich Strike
Zenyatta
Ruffian
Spectacular Bid
Bucephalus
Marengo
Traveller
Comanche
Hidalgo
Champion
Scout
Topper
Boxer
Artax
Epona
Sleipnir
Incitatus
Copenhagen
Red Rum
Arkle
Phar Lap
Frankel
Mystik Dan
Sovereignty
Applejack
Hercules
`),
    angle('chinese_zodiac', 'holidays', 'category', 'Name an animal of the Chinese zodiac.', `
1 Dragon
1 Tiger
1 Rabbit
1 Horse
1 Snake
1 Monkey
1 Dog
1 Pig
2 Rat
2 Ox
2 Rooster
2 Goat|Sheep|Ram`),
    angle('anniversary_gifts', 'holidays', 'time', 'Name a traditional wedding anniversary gift.', `
1 Paper
1 Silver
1 Gold
1 Diamond
2 Cotton
2 Leather
2 Wood
2 Tin
2 Crystal
2 Pearl
2 Ruby
2 Linen|Fruit|Flowers
2 Iron
2 Wool|Copper
2 Bronze
2 Pottery|Willow
2 Aluminum
2 Steel
2 Silk
2 Lace
2 Ivory
2 China
2 Sapphire
2 Emerald
2 Coral|Jade
Sugar
Platinum`),
    angle('keys_things', 'words', 'wordplay', 'Name something that has keys.', `
1 Piano
1 Keyboard|Computer keyboard
1 Car
1 House|Home
2 Typewriter
2 Laptop|Computer
2 Calculator
2 Organ
2 Accordion
2 Lock|Padlock
Map
Florida|Florida Keys
Answer key
Xylophone
Janitor
Locksmith
Safe
Diary
Synthesizer
Harpsichord
Cash register
Phone
Remote|Remote control
Keychain|Key ring`),
    angle('pasta_sauce', 'food', 'category', 'Name a pasta sauce.', `
1 Marinara
1 Alfredo
1 Pesto
1 Meat sauce|Bolognese|Ragù|Ragu
1 Tomato|Tomato sauce
2 Carbonara
2 Vodka|Vodka sauce|Penne alla vodka
2 Puttanesca
2 Arrabbiata|Arrabiata
2 Cacio e pepe
2 Aglio e olio|Garlic and oil
2 Clam sauce|White clam sauce|Vongole
2 Butter|Brown butter
2 Cheese sauce
2 Primavera
Amatriciana
Pomodoro
Rosé|Rose sauce|Pink sauce
Gorgonzola
Four cheese|Quattro formaggi
Genovese
Norma
Romesco
Bechamel|Béchamel
Mushroom
Sunday gravy|Gravy`),
    angle('salads', 'food', 'category', 'Name a kind of salad.', `
1 Caesar
1 Garden|House|Green
1 Greek
1 Potato
1 Cobb
1 Fruit
1 Pasta
2 Chef
2 Waldorf
2 Caprese
2 Coleslaw|Slaw
2 Taco
2 Wedge
2 Chicken
2 Egg
2 Tuna
2 Spinach
2 Kale
Niçoise|Nicoise
Asian|Chinese chicken
Quinoa
Cucumber
Macaroni
Three-bean|Bean
Tabbouleh
Fattoush
Panzanella
Ambrosia
Seven-layer
Broccoli
Watermelon
Beet
Arugula
Southwest
Antipasto
Shrimp
Crab
Jell-O|Jello
Mixed greens`),
    angle('soups', 'food', 'category', 'Name a soup.', `
1 Chicken noodle
1 Tomato
1 Minestrone
1 French onion|Onion
1 Clam chowder|Chowder|New England clam chowder
1 Split pea
1 Vegetable
2 Lentil
2 Gazpacho
2 Pho
2 Ramen
2 Miso
2 Gumbo
2 Chili
2 Lobster bisque|Bisque
2 Broccoli cheddar
2 Potato leek|Potato
2 Matzo ball
2 Wonton
2 Egg drop
2 Hot and sour
2 Tortilla
2 Italian wedding
2 Borscht
2 Butternut squash
2 Corn chowder
2 Chicken and rice
2 Beef stew|Stew
Mulligatawny
Bean
Black bean
Manhattan clam chowder
Pozole
Menudo
Tom yum
Tom kha
Avgolemono
Vichyssoise
Bouillabaisse
Cioppino
Mushroom
Pumpkin
Cream of mushroom
Chicken tortilla
Udon
Laksa`),
    angle('mexican_food', 'food', 'place', 'Name a Mexican dish.', `
1 Taco|Tacos
1 Burrito|Burritos
1 Enchilada|Enchiladas
1 Quesadilla|Quesadillas
1 Nachos
1 Guacamole
1 Tamale|Tamales
1 Fajitas
1 Salsa
2 Chimichanga
2 Tostada
2 Churros|Churro
2 Pozole
2 Mole
2 Elote|Mexican street corn
2 Carnitas
2 Tortilla soup
2 Flautas|Taquitos
2 Chile relleno|Chiles rellenos
2 Chilaquiles
2 Birria
2 Queso
2 Tres leches
2 Huevos rancheros
2 Ceviche
2 Barbacoa
2 Al pastor|Tacos al pastor
Sopes
Gorditas
Menudo
Torta|Tortas
Huaraches
Empanadas
Cochinita pibil
Tlayuda
Esquites
Horchata
Flan
Pico de gallo
Refried beans
Mexican rice|Spanish rice
Carne asada
Chorizo`),
    angle('chinese_takeout', 'food', 'place', 'Name a dish on a Chinese takeout menu.', `
1 Fried rice
1 Lo mein
1 Egg roll|Egg rolls
1 General Tso's chicken|General Tso's|General Tso chicken
1 Orange chicken
1 Sweet and sour chicken|Sweet and sour pork|Sweet and sour
1 Kung pao chicken|Kung pao
1 Chow mein
1 Wonton soup
1 Dumplings|Potstickers
2 Crab rangoon
2 Beef and broccoli|Broccoli beef
2 Sesame chicken
2 Egg foo young|Egg foo yung
2 Moo shu|Moo shu pork
2 Hot and sour soup
2 Spring rolls|Spring roll
2 Egg drop soup
2 Mongolian beef
2 Fortune cookie|Fortune cookies
2 Chop suey
2 Lemon chicken
2 Cashew chicken
2 Walnut shrimp|Honey walnut shrimp
2 Mapo tofu
2 Peking duck
2 Szechuan beef|Szechuan chicken
2 Spare ribs|Boneless spare ribs
Char siu|BBQ pork
Dim sum
Bao|Steamed buns
Scallion pancakes
Pepper steak
Shrimp with lobster sauce
Moo goo gai pan
Chicken with broccoli
Hunan chicken
Garlic chicken`),
    angle('italian_dishes', 'food', 'place', 'Name an Italian dish.', `
1 Lasagna|Lasagne
1 Spaghetti and meatballs|Spaghetti
1 Pizza
1 Fettuccine Alfredo|Alfredo
1 Chicken Parmesan|Chicken Parm|Chicken parmigiana
1 Risotto
1 Ravioli
1 Tiramisu
2 Carbonara|Spaghetti carbonara
2 Eggplant Parmesan|Eggplant parm
2 Gnocchi
2 Osso buco
2 Bruschetta
2 Caprese salad|Caprese
2 Minestrone
2 Calzone
2 Panna cotta
2 Cannoli
2 Gelato
2 Focaccia
2 Arancini
2 Polenta
2 Chicken piccata|Piccata
2 Chicken Marsala|Marsala
2 Baked ziti|Ziti
2 Manicotti
2 Stromboli
Carpaccio
Saltimbocca
Chicken cacciatore|Cacciatore
Pesto pasta
Vitello tonnato
Cacio e pepe
Linguine with clams
Frittata
Panzanella
Biscotti
Affogato
Zabaglione
Spumoni
Prosciutto e melone
Cotoletta
Porchetta
Pasta e fagioli|Pasta fazool`),
    angle('cookies', 'food', 'category', 'Name a kind of cookie.', `
1 Chocolate chip
1 Oatmeal raisin|Oatmeal
1 Sugar
1 Peanut butter
1 Snickerdoodle|Snickerdoodles
1 Gingerbread
1 Oreo|Oreos
1 Shortbread
2 Macaron|Macarons|French macaron
2 Biscotti
2 Fortune cookie
2 Fig Newton|Fig Newtons
2 Thin Mints|Thin Mint
2 Molasses
2 Black and white
2 Ginger snap|Gingersnap|Gingersnaps
2 Chips Ahoy!|Chips Ahoy
2 Nutter Butter
2 Animal crackers
2 Macaroon
2 Butter cookie|Butter cookies
2 Double chocolate
2 White chocolate macadamia|Macadamia nut
2 Thumbprint
Linzer
Madeleine|Madeleines
Pizzelle
Rugelach
Nilla wafer|Vanilla wafer
Milano
Pecan sandies|Sandies
Russian tea cakes|Snowballs|Mexican wedding cookies
Spritz
Amaretti
Florentine
Crinkle|Chocolate crinkle
Samoas|Caramel deLites
Tagalongs
Do-si-dos
Lemon
Sandwich cookie
Whoopie pie
Anzac biscuit
Stroopwafel
Alfajores
Speculoos|Biscoff`),
    angle('pies', 'food', 'category', 'Name a kind of pie.', `
1 Apple
1 Pumpkin
1 Pecan
1 Cherry
1 Key lime
1 Blueberry
1 Lemon meringue
2 Banana cream
2 Coconut cream
2 Chocolate cream|Chocolate
2 Sweet potato
2 Peach
2 Strawberry rhubarb|Rhubarb
2 Strawberry
2 Chicken pot pie|Pot pie
2 Shepherd's pie
2 Mud pie
2 French silk
2 Boston cream
2 Chess
2 Shoofly
2 Blackberry
2 Mince|Mincemeat
2 Mixed berry|Berry|Triple berry
Banoffee
Grasshopper
Buttermilk
Sugar cream
Custard
Raspberry
Plum
Pear
Cottage pie
Pork pie
Steak and kidney
Tamale pie
Frito pie
Whoopie pie
Moon pie|MoonPie
Pizza pie`),
    angle('beers', 'drink', 'category', 'Name a beer brand.', `
1 Budweiser|Bud
1 Bud Light
1 Coors|Coors Banquet
1 Coors Light
1 Miller Lite|Miller
1 Corona
1 Heineken
1 Guinness
2 Stella Artois|Stella
2 Modelo|Modelo Especial|Negra Modelo
2 Michelob Ultra|Michelob
2 Blue Moon
2 Samuel Adams|Sam Adams
2 Pabst Blue Ribbon|PBR|Pabst
2 Busch|Busch Light
2 Natural Light|Natty Light|Natty
2 Dos Equis
2 Pacifico
2 Yuengling
2 Sierra Nevada
2 Labatt
2 Molson
2 Keystone|Keystone Light
2 Rolling Rock
2 Beck's|Becks
2 Amstel|Amstel Light
2 Peroni
2 Sapporo
2 Kirin
2 Asahi
2 Tsingtao
2 Foster's|Fosters
2 Newcastle
2 Red Stripe
2 Tecate
Bass
Hamm's|Hamms
Schlitz
Old Milwaukee
Lagunitas
Goose Island
Fat Tire|New Belgium
Leinenkugel's|Leinenkugel|Leinie's
Shiner|Shiner Bock
Kona|Kona Big Wave
Sol
Carlsberg
Pilsner Urquell
Hoegaarden
Bell's|Bell's Two Hearted
Dogfish Head
Stone
Anchor Steam
Grolsch
Kingfisher
Singha
Tusker
Presidente
Medalla
Rainier
Olympia
Genesee
Narragansett
Lone Star
Iron City
Old Style`),
    angle('competition_tv', 'tv', 'category', 'Name a reality competition show.', `
1 Survivor
1 The Bachelor|Bachelor
1 American Idol
1 The Voice
1 Big Brother
1 Dancing with the Stars|DWTS
1 America's Got Talent|AGT
1 The Amazing Race|Amazing Race
2 The Bachelorette|Bachelorette
2 Top Chef
2 Project Runway
2 RuPaul's Drag Race|Drag Race
2 The Great British Bake Off|Great British Baking Show|Bake Off
2 Love Island
2 The Masked Singer|Masked Singer
2 Hell's Kitchen
2 MasterChef
2 The Traitors|Traitors
2 The Biggest Loser|Biggest Loser
2 America's Next Top Model|Top Model
2 So You Think You Can Dance
2 American Ninja Warrior|Ninja Warrior
2 Chopped
2 Nailed It!|Nailed It
2 The Apprentice|Apprentice
2 Love Is Blind
2 Fear Factor
2 Wipeout
2 Squid Game: The Challenge
2 Beast Games
2 The Challenge
2 Lego Masters
2 Bachelor in Paradise
Too Hot to Handle
The Circle
Are You the One?|Are You the One
Physical: 100
Making the Cut
Forged in Fire
Ink Master
Blown Away
Next Level Chef
The Golden Bachelor
X Factor|The X Factor
Star Search
Rock of Love
Flavor of Love
Holey Moley
Alone
Floor Is Lava
Glow Up`),
    angle('game_shows', 'tv', 'category', 'Name a TV game show.', `
1 Jeopardy!|Jeopardy
1 Wheel of Fortune
1 The Price Is Right|Price Is Right
1 Family Feud
1 Who Wants to Be a Millionaire?|Who Wants to Be a Millionaire|Millionaire
1 Deal or No Deal
2 Let's Make a Deal
2 Hollywood Squares
2 Match Game
2 The Newlywed Game|Newlywed Game
2 The Dating Game|Dating Game
2 Password
2 Pyramid|The $100,000 Pyramid|$100,000 Pyramid|The $25,000 Pyramid
2 Press Your Luck
2 Card Sharks
2 Supermarket Sweep
2 Double Dare
2 Weakest Link|The Weakest Link
2 Minute to Win It
2 The Chase
2 Are You Smarter Than a 5th Grader?|Are You Smarter Than a Fifth Grader
2 Cash Cab
2 Name That Tune
2 Legends of the Hidden Temple
Tic-Tac-Dough
Concentration
To Tell the Truth
What's My Line?|What's My Line
Sale of the Century
Chain Reaction
Lingo
Blockbusters
Win Ben Stein's Money
1 vs. 100|1 vs 100
Beat Shazam
The Wall
Pointless
Countdown
Catchphrase
Celebrity Name Game
Scrabble
Jackpot!
The Joker's Wild`),
    angle('lawyer_tv', 'tv', 'place', 'Name a TV show about lawyers.', `
1 Law & Order|Law and Order
1 Suits
1 The Good Wife|Good Wife
1 Better Call Saul
1 How to Get Away with Murder
1 Matlock
1 Perry Mason
2 Boston Legal
2 L.A. Law|LA Law
2 Ally McBeal
2 The Practice
2 Damages
2 The Good Fight
2 The Lincoln Lawyer|Lincoln Lawyer
2 Law & Order: Special Victims Unit|SVU|Law and Order SVU
2 Drop Dead Diva
2 Bull
2 JAG
2 All Rise
2 Goliath
2 Night Court
Franklin & Bash
Harry's Law
Shark
For the People
Reasonable Doubt
Rumpole of the Bailey|Rumpole
Silk
The Defenders
Doubt
Rake
She-Hulk: Attorney at Law|She-Hulk
Extraordinary Attorney Woo
Judge Judy`),
    angle('boy_bands', 'music', 'category', 'Name a boy band.', `
1 Backstreet Boys
1 *NSYNC|NSYNC|N Sync|N'Sync
1 New Kids on the Block|NKOTB
1 One Direction
1 BTS
1 Jonas Brothers
1 Boyz II Men
2 New Edition
2 98 Degrees|98°
2 Hanson
2 Westlife
2 Take That
2 The Jackson 5|Jackson 5
2 Menudo
2 O-Town|O Town
2 Big Time Rush
2 The Wanted
2 5 Seconds of Summer|5SOS
2 The Osmonds
2 The Monkees
2 Boyzone
2 B2K
2 Stray Kids
2 EXO
2 Seventeen
2 CNCO
Color Me Badd
Dream Street
LFO
Blue
Bell Biv DeVoe
112
Jodeci
Why Don't We
PrettyMuch
NCT
Big Bang
Super Junior
Plus One
Bay City Rollers
The Bee Gees|Bee Gees
Brother Beyond
East 17
JLS
Busted
McFly
Another Level
Immature|IMx
Hi-Five`),
    angle('girl_groups', 'music', 'category', 'Name a girl group.', `
1 Spice Girls
1 Destiny's Child
1 TLC
1 The Supremes|Supremes
1 Fifth Harmony
1 The Pussycat Dolls|Pussycat Dolls
1 En Vogue
2 Little Mix
2 The Go-Go's|Go-Go's|Go Gos
2 Bananarama
2 The Ronettes|Ronettes
2 The Shirelles|Shirelles
2 The Pointer Sisters|Pointer Sisters
2 Salt-N-Pepa|Salt n Pepa
2 SWV
2 Xscape
2 All Saints
2 Sugababes
2 Girls Aloud
2 Wilson Phillips
2 Blackpink
2 Twice
2 Girls' Generation
2 The Andrews Sisters|Andrews Sisters
2 The Bangles|Bangles
2 The Chicks|Dixie Chicks
2 Haim
2 3LW
2 Danity Kane
2 Martha and the Vandellas
2 The Marvelettes|Marvelettes
2 The Shangri-Las|Shangri-Las
2 The Chordettes|Chordettes
2 Labelle
2 Sister Sledge
2 The Runaways|Runaways
2 NewJeans
2 Katseye
Atomic Kitten
Exposé|Expose
The Emotions
The McGuire Sisters
The Crystals
The Chiffons
Mel and Kim
Red Velvet
Aespa
Itzy
Mamamoo
The Saturdays
Eternal
702
Total
Blaque
Cleopatra`),
    angle('country_singers', 'music', 'people', 'Name a country music singer.', `
1 Dolly Parton|Dolly
1 Johnny Cash
1 Willie Nelson
1 Garth Brooks
1 Shania Twain
1 Carrie Underwood
1 Reba McEntire|Reba
1 Taylor Swift
1 Luke Bryan
1 Blake Shelton
1 Kenny Chesney
1 Tim McGraw
1 Faith Hill
1 Morgan Wallen
2 Luke Combs
2 Chris Stapleton
2 Miranda Lambert
2 Keith Urban
2 Kacey Musgraves
2 Patsy Cline
2 Loretta Lynn
2 George Strait
2 Alan Jackson
2 Brad Paisley
2 Toby Keith
2 Kenny Rogers
2 Hank Williams
2 Waylon Jennings
2 Merle Haggard
2 Tammy Wynette
2 Randy Travis
2 Martina McBride
2 LeAnn Rimes
2 Trisha Yearwood
2 Jason Aldean
2 Zac Brown
2 Lainey Wilson
2 Zach Bryan
2 Kelsea Ballerini
2 Thomas Rhett
2 Florida Georgia Line
2 Lady A|Lady Antebellum
2 Rascal Flatts
2 Sugarland
2 The Judds|Wynonna Judd|Naomi Judd
2 Brooks & Dunn|Brooks and Dunn
2 Dierks Bentley
2 Eric Church
2 Jelly Roll
2 Darius Rucker
2 Glen Campbell
2 John Denver
2 Charley Pride
2 Conway Twitty
2 Vince Gill
2 Clint Black
2 Travis Tritt
2 Gretchen Wilson
2 Sara Evans
2 Jo Dee Messina
2 Lee Ann Womack
2 Kane Brown
2 Maren Morris
2 Gabby Barrett
2 Cody Johnson
2 Hardy
2 Bailey Zimmerman
2 Megan Moroney
2 Chris Young
2 Cole Swindell
2 Mickey Guyton
2 Little Big Town
2 Old Dominion
2 Billy Ray Cyrus
2 Wynonna
2 Beyoncé|Beyonce`),
    angle('disney_villains', 'movies', 'people', 'Name a Disney villain.', `
1 Ursula
1 Maleficent
1 Scar
1 Jafar
1 Cruella de Vil|Cruella
1 Gaston
1 Captain Hook|Hook
1 The Evil Queen|Evil Queen|Queen Grimhilde
1 Hades
1 Mother Gothel
2 Lady Tremaine|Wicked Stepmother|Stepmother
2 Shere Khan
2 Hans|Prince Hans
2 Dr. Facilier|Facilier|Shadow Man
2 Yzma
2 Ratigan
2 Frollo|Judge Claude Frollo
2 Governor Ratcliffe|Ratcliffe
2 Shan Yu
2 Kaa
2 Queen of Hearts
2 Prince John
2 Sid
2 Syndrome
2 Lotso
2 Randall
2 Hopper
2 Madam Mim
2 Medusa|Madame Medusa
2 Clayton
2 Stromboli
2 Chernabog
2 Te Kā|Te Ka
2 Tamatoa
2 King Magnifico|Magnifico
Horned King
Edgar
Honest John
Pete
Bowler Hat Guy
Sykes
Percival C. McLeach|McLeach
Professor Callaghan|Yokai
Charles Muntz
Chick Hicks
Captain Gantu|Gantu
Dr. Hämsterviel
King Candy|Turbo
Bellwether
Ernesto de la Cruz
Mr. Waternoose|Waternoose
Big Bad Wolf`),
    angle('disney_animated', 'movies', 'category', 'Name a Disney animated movie.', `
1 The Lion King|Lion King
1 Frozen
1 Aladdin
1 The Little Mermaid|Little Mermaid
1 Beauty and the Beast
1 Cinderella
1 Snow White and the Seven Dwarfs|Snow White
1 Moana
1 Tangled
1 Bambi
1 Dumbo
1 Pinocchio
1 Peter Pan
1 Sleeping Beauty
1 Mulan
1 Encanto
2 Zootopia
2 Lilo & Stitch|Lilo and Stitch
2 Pocahontas
2 Hercules
2 Tarzan
2 The Jungle Book|Jungle Book
2 101 Dalmatians|One Hundred and One Dalmatians
2 Lady and the Tramp
2 Alice in Wonderland
2 The Princess and the Frog|Princess and the Frog
2 Wreck-It Ralph
2 Big Hero 6
2 Frozen II|Frozen 2
2 Moana 2
2 Zootopia 2
2 The Aristocats|Aristocats
2 Robin Hood
2 The Fox and the Hound|Fox and the Hound
2 The Hunchback of Notre Dame|Hunchback of Notre Dame
2 The Emperor's New Groove|Emperor's New Groove
2 Fantasia
2 Bolt
2 Wish
2 Raya and the Last Dragon|Raya
2 Strange World
2 Meet the Robinsons
2 Chicken Little
2 Treasure Planet
2 Atlantis: The Lost Empire|Atlantis
2 Brother Bear
2 Home on the Range
2 Dinosaur
2 The Rescuers|Rescuers
2 The Rescuers Down Under
2 Oliver & Company|Oliver and Company
2 The Great Mouse Detective|Great Mouse Detective
2 The Black Cauldron|Black Cauldron
2 The Sword in the Stone|Sword in the Stone
2 The Many Adventures of Winnie the Pooh|Winnie the Pooh
2 Ralph Breaks the Internet
Fantasia 2000
The Three Caballeros
Saludos Amigos
Make Mine Music
Fun and Fancy Free
Melody Time
The Adventures of Ichabod and Mr. Toad`),
    angle('toy_story_chars', 'movies', 'people', 'Name a "Toy Story" character.', `
1 Woody
1 Buzz Lightyear|Buzz
1 Jessie
1 Rex
1 Hamm
1 Slinky Dog|Slinky
1 Mr. Potato Head|Mr Potato Head|Potato Head
1 Bo Peep|Bo
2 Andy
2 Sid
2 Bullseye
2 Mrs. Potato Head|Mrs Potato Head
2 Stinky Pete|The Prospector|Prospector
2 Lotso|Lots-o'-Huggin' Bear
2 Ken
2 Barbie
2 Forky
2 Duke Caboom
2 Gabby Gabby
2 Zurg|Emperor Zurg
2 Aliens|Little Green Men|Alien
2 Wheezy
2 Bonnie
2 Al|Al McWhiggin
2 Trixie
2 Mr. Pricklepants
2 Big Baby
2 Ducky
2 Bunny
2 Molly
2 Sarge
2 Lenny
2 Etch|Etch A Sketch
2 RC
2 Combat Carl
2 Twitch
2 Chuckles
2 Dolly
2 Buttercup
Hannah
Scud
Mr. Spell
Rocky Gibraltar
Bookworm
Stretch
Chunk
Sparks`),
    angle('seinfeld_chars', 'tv', 'people', 'Name a "Seinfeld" character.', `
1 Jerry|Jerry Seinfeld
1 George|George Costanza
1 Elaine|Elaine Benes
1 Kramer|Cosmo Kramer
1 Newman
2 Frank Costanza
2 Estelle Costanza
2 Uncle Leo
2 Puddy|David Puddy
2 J. Peterman|Peterman
2 Mr. Pitt
2 Kenny Bania|Bania
2 Jackie Chiles
2 The Soup Nazi|Soup Nazi
2 Morty Seinfeld
2 Helen Seinfeld
2 Susan Ross|Susan
2 Mickey
2 Babu
2 George Steinbrenner|Steinbrenner
Lloyd Braun
Mr. Lippman|Lippman
Tim Whatley
Bob Sacamano
Crazy Joe Davola|Joe Davola
Sue Ellen Mischke
Jack Klompus`),
    angle('office_chars', 'tv', 'people', 'Name a character from "The Office."', `
1 Michael Scott|Michael
1 Dwight Schrute|Dwight
1 Jim Halpert|Jim
1 Pam Beesly|Pam|Pam Halpert
1 Andy Bernard|Andy
1 Angela Martin|Angela
1 Kevin Malone|Kevin
1 Creed Bratton|Creed
2 Ryan Howard|Ryan
2 Oscar Martinez|Oscar
2 Stanley Hudson|Stanley
2 Phyllis Vance|Phyllis
2 Meredith Palmer|Meredith
2 Kelly Kapoor|Kelly
2 Toby Flenderson|Toby
2 Darryl Philbin|Darryl
2 Erin Hannon|Erin
2 Jan Levinson|Jan
2 Holly Flax|Holly
2 Gabe Lewis|Gabe
2 Robert California
2 Karen Filippelli|Karen
2 David Wallace
2 Roy Anderson|Roy
2 Nellie Bertram|Nellie
2 Todd Packer|Packer
Clark Green
Pete Miller
Jo Bennett
Deangelo Vickers
Mose Schrute|Mose
Charles Miner
Hank
Nate
Bob Vance`),
    angle('famous_smith', 'people', 'people', 'Name a famous Smith.', `
1 Will Smith
1 Jada Pinkett Smith
1 Sam Smith
1 Maggie Smith
1 Anna Nicole Smith
2 Patti Smith
2 Kevin Smith
2 Emmitt Smith
2 Joseph Smith
2 Adam Smith
2 John Smith
2 Jaden Smith
2 Willow Smith
2 Matt Smith
2 Robert Smith
2 Bessie Smith
2 Jaclyn Smith
2 Kate Smith
2 Ozzie Smith
2 Tommie Smith
2 Zadie Smith
2 Elliott Smith
2 Michael W. Smith
2 Shepard Smith
2 Liz Smith
2 Margaret Chase Smith
2 Anna Deavere Smith
2 Granger Smith
2 Lovie Smith`),
    angle('famous_twins', 'people', 'people', 'Name a famous twin.', `
1 Mary-Kate Olsen|Mary-Kate|Mary Kate Olsen
1 Ashley Olsen
1 Tia Mowry|Tia
1 Tamera Mowry|Tamera
1 Dylan Sprouse
1 Cole Sprouse
2 Scarlett Johansson
2 Ashton Kutcher
2 Kiefer Sutherland
2 Alanis Morissette
2 Vin Diesel
2 Gisele Bündchen|Gisele Bundchen
2 Jenna Bush
2 Barbara Bush
2 Mark Kelly
2 Scott Kelly
2 Drew Scott
2 Jonathan Scott
2 Brie Bella
2 Nikki Bella
2 Romulus
2 Remus
2 Jacob
2 Esau
2 Castor
2 Pollux
2 Fred Weasley
2 George Weasley
2 Tweedledum
2 Tweedledee
2 Cameron Winklevoss
2 Tyler Winklevoss
2 Tiki Barber
2 Ronde Barber
2 Bob Bryan
2 Mike Bryan
2 Henrik Sedin
2 Daniel Sedin
2 Benji Madden
2 Joel Madden
2 Esther Lederer|Ann Landers
2 Pauline Phillips|Dear Abby
2 Elvis Presley`),
    angle('two_word_states', 'geo', 'wordplay', 'Name a U.S. state with a two-word name.', `
1 New York
1 New Jersey
1 North Carolina
1 South Carolina
1 West Virginia
2 New Mexico
2 New Hampshire
2 North Dakota
2 South Dakota
2 Rhode Island`),
    angle('florida_cities', 'geo', 'place', 'Name a city in Florida.', `
1 Miami
1 Orlando
1 Tampa
1 Jacksonville
1 Tallahassee
1 Fort Lauderdale
1 Key West
2 St. Petersburg|St Petersburg|Saint Petersburg
2 West Palm Beach
2 Naples
2 Sarasota
2 Gainesville
2 Pensacola
2 Daytona Beach|Daytona
2 Fort Myers
2 Clearwater
2 Boca Raton
2 Miami Beach
2 Palm Beach
2 St. Augustine|St Augustine|Saint Augustine
2 Panama City|Panama City Beach
2 Destin
2 Kissimmee
2 Cocoa Beach
Hialeah
Cape Coral
Port St. Lucie
Coral Springs
Hollywood
Ocala
Lakeland
Melbourne
Delray Beach
Boynton Beach
Pompano Beach
Coral Gables
Homestead
Vero Beach
Bradenton
Winter Park
Key Largo
Marco Island
Apalachicola
Titusville
Sebring
Sanford
Palm Coast
Fernandina Beach
Venice
Punta Gorda`),
    angle('california_cities', 'geo', 'place', 'Name a city in California.', `
1 Los Angeles|LA|L.A.
1 San Francisco|SF
1 San Diego
1 Sacramento
1 San Jose
1 Oakland
1 Hollywood
1 Malibu
1 Beverly Hills
1 Palm Springs
2 Fresno
2 Long Beach
2 Santa Barbara
2 Anaheim
2 Pasadena
2 Berkeley
2 Santa Monica
2 Napa
2 Santa Cruz
2 Monterey
2 Carmel|Carmel-by-the-Sea
2 Irvine
2 Bakersfield
2 Palo Alto
2 Cupertino
2 Huntington Beach
2 Newport Beach
2 Laguna Beach
2 Sonoma
2 Sausalito
2 Burbank
Riverside
Stockton
Modesto
Santa Clara
Sunnyvale
Mountain View
Glendale
Torrance
San Bernardino
Chula Vista
Oceanside
Escondido
Redding
Eureka
Chico
Davis
Temecula
Ventura
Oxnard
Thousand Oaks
Compton
Inglewood
West Hollywood
San Luis Obispo
Santa Rosa
Fremont
Hayward
Vallejo
Visalia
Barstow
Big Bear Lake
South Lake Tahoe
Coronado
Del Mar
La Jolla
Carlsbad
Ojai
Solvang
Yountville
Half Moon Bay`),
    angle('mexico_cities', 'geo', 'place', 'Name a city in Mexico.', `
1 Mexico City|Ciudad de México|CDMX
1 Cancún|Cancun
1 Guadalajara
1 Monterrey
1 Tijuana
1 Puerto Vallarta
1 Acapulco
1 Cabo San Lucas|Cabo
2 Oaxaca
2 Puebla
2 Mérida|Merida
2 Playa del Carmen
2 Tulum
2 Mazatlán|Mazatlan
2 San Miguel de Allende
2 Ensenada
2 Ciudad Juárez|Juárez|Juarez
2 Chihuahua
2 Veracruz
2 Querétaro|Queretaro
2 Guanajuato
2 Cozumel
2 Zihuatanejo
2 La Paz
2 Rosarito
2 Sayulita
2 Isla Mujeres
León|Leon
Morelia
Toluca
Cuernavaca
Taxco
Hermosillo
Ixtapa
Huatulco
Campeche
Durango
Saltillo
Torreón|Torreon
Culiacán|Culiacan
Aguascalientes
San Luis Potosí|San Luis Potosi
Zacatecas
Tampico
Villahermosa
Tuxtla Gutiérrez|Tuxtla Gutierrez
San Cristóbal de las Casas|San Cristobal de las Casas
Nuevo Laredo
Matamoros
Reynosa
Mexicali
Nogales
Todos Santos
Bacalar
Valladolid
San José del Cabo|San Jose del Cabo`),
    angle('rivers', 'geo', 'category', 'Name a famous river.', `
1 Nile
1 Amazon
1 Mississippi
1 Thames
1 Seine
1 Rio Grande
1 Colorado
2 Danube
2 Rhine
2 Yangtze
2 Ganges
2 Missouri
2 Hudson
2 Ohio
2 Volga
2 Mekong
2 Tigris
2 Euphrates
2 Jordan
2 Congo
2 Columbia
2 Potomac
2 Tiber
2 Snake
2 St. Lawrence|St Lawrence|Saint Lawrence
2 Delaware
2 Niger
2 Zambezi
2 Yellow River|Huang He
2 Indus
2 Loire
2 Arno
2 Shannon
2 Liffey
2 Charles
2 Chicago River
2 Tennessee
Po
Elbe
Douro
Tagus
Ebro
Rhône|Rhone
Arkansas
Red River
Platte
Susquehanna
Yukon
Mackenzie
Orinoco
Paraná|Parana
Murray
Darling
Brahmaputra
Irrawaddy
Ob
Yenisei
Lena
Amur
Dnieper
Vistula
Oder
Sacramento
Willamette
Cumberland
James
Savannah
Allegheny
Monongahela`),
    angle('mountain_ranges', 'geo', 'category', 'Name a mountain range.', `
1 Rocky Mountains|Rockies|Rocky
1 Himalayas|Himalaya
1 Andes
1 Alps
1 Appalachian Mountains|Appalachians|Appalachian
2 Sierra Nevada|Sierras
2 Cascades|Cascade Range
2 Pyrenees
2 Ural Mountains|Urals
2 Atlas Mountains|Atlas
2 Carpathians|Carpathian Mountains
2 Great Smoky Mountains|Smoky Mountains|Smokies
2 Blue Ridge Mountains|Blue Ridge
2 Adirondacks|Adirondack Mountains
2 Catskills|Catskill Mountains
2 Ozarks|Ozark Mountains
2 Tetons|Teton Range
2 Black Hills
2 Sierra Madre
2 Dolomites
2 Apennines
2 Alaska Range
2 Brooks Range
2 Wasatch|Wasatch Range
Caucasus
Hindu Kush
Karakoram
Tian Shan
Altai
Zagros
Great Dividing Range
Drakensberg
Scottish Highlands|Highlands
Pennines
Green Mountains
White Mountains
Berkshires
Poconos
Coast Mountains
Olympic Mountains
San Juan Mountains
Bitterroot Range|Bitterroots
Ruwenzori|Rwenzori
Snowy Mountains
Southern Alps
Sangre de Cristo Mountains
San Gabriel Mountains
Santa Monica Mountains
Bighorn Mountains
Wind River Range
Sawtooth Range|Sawtooths`),
    angle('deserts', 'geo', 'category', 'Name a desert.', `
1 Sahara
1 Mojave
1 Gobi
1 Death Valley
1 Sonoran
1 Kalahari
1 Atacama
2 Arabian
2 Antarctic|Antarctica
2 Arctic
2 Great Basin
2 Chihuahuan
2 Namib
2 Thar
2 Great Victoria
2 Taklamakan
2 Patagonian
2 Painted Desert
2 Negev
2 Sinai
2 Rub' al Khali|Empty Quarter
Syrian
Karakum
Kyzylkum
Simpson
Great Sandy
Libyan
Nubian
Dasht-e Kavir
Colorado Desert
Black Rock Desert|Black Rock
Great Salt Lake Desert
Gibson
Tanami
Danakil
Ogaden
Judaean
Owyhee
Red Desert
Alvord`),
    angle('seas', 'geo', 'category', 'Name an ocean or sea.', `
1 Pacific|Pacific Ocean
1 Atlantic|Atlantic Ocean
1 Indian|Indian Ocean
1 Arctic|Arctic Ocean
1 Mediterranean|Mediterranean Sea
1 Caribbean|Caribbean Sea
1 Dead Sea
1 Red Sea
1 Black Sea
2 Southern|Southern Ocean|Antarctic Ocean
2 Caspian|Caspian Sea
2 Baltic|Baltic Sea
2 North Sea
2 Aegean|Aegean Sea
2 Adriatic|Adriatic Sea
2 Arabian Sea
2 South China Sea
2 Coral Sea
2 Bering Sea
2 Sea of Japan|East Sea
2 Yellow Sea
2 Tasman Sea
2 Ionian Sea
2 Irish Sea
2 Sea of Galilee
2 Salton Sea
Tyrrhenian Sea
Labrador Sea
Sargasso Sea
Weddell Sea
Ross Sea
Barents Sea
Kara Sea
Sea of Okhotsk
Philippine Sea
Java Sea
Andaman Sea
Celtic Sea
Ligurian Sea
Sea of Marmara
Sea of Azov
East China Sea
Norwegian Sea
Greenland Sea
Beaufort Sea
Bismarck Sea
Timor Sea
Arafura Sea
Sulu Sea
Celebes Sea
Aral Sea`),
    angle('great_lakes', 'geo', 'category', 'Name one of the Great Lakes.', `
1 Michigan|Lake Michigan
1 Superior|Lake Superior
1 Erie|Lake Erie
2 Huron|Lake Huron
2 Ontario|Lake Ontario`),
    angle('hawaii_islands', 'geo', 'place', 'Name a Hawaiian island.', `
1 Maui
1 Oahu|Oʻahu
1 Kauai|Kauaʻi
1 Hawaii|Big Island|Hawaiʻi
2 Molokai|Molokaʻi
2 Lanai|Lānaʻi
4 Niihau|Niʻihau
4 Kahoolawe|Kahoʻolawe`),
    angle('canada_provinces', 'geo', 'place', 'Name a Canadian province or territory.', `
1 Ontario
1 Quebec|Québec
1 British Columbia|BC
1 Alberta
2 Manitoba
2 Saskatchewan
2 Nova Scotia
2 New Brunswick
2 Newfoundland and Labrador|Newfoundland|Labrador
2 Prince Edward Island|PEI
2 Yukon
2 Northwest Territories
4 Nunavut`),
    angle('australia_states', 'geo', 'place', 'Name an Australian state or territory.', `
1 New South Wales
1 Victoria
1 Queensland
2 Western Australia
2 South Australia
2 Tasmania
2 Northern Territory
4 Australian Capital Territory|ACT`),
    angle('nyc_boroughs', 'geo', 'place', 'Name a borough of New York City.', `
1 Manhattan
1 Brooklyn
1 Queens
1 The Bronx|Bronx
2 Staten Island`),
    angle('disney_parks', 'geo', 'place', 'Name a Disney theme park.', `
1 Magic Kingdom
1 Disneyland
1 Epcot|EPCOT
1 Animal Kingdom|Disney's Animal Kingdom
1 Hollywood Studios|Disney's Hollywood Studios|MGM Studios
2 Disney California Adventure|California Adventure
2 Disneyland Paris|Euro Disney
2 Tokyo Disneyland
2 Tokyo DisneySea|DisneySea
2 Hong Kong Disneyland
2 Shanghai Disneyland
2 Typhoon Lagoon
2 Blizzard Beach
4 Walt Disney Studios Park|Disney Adventure World`),
    angle('vegas_casinos', 'geo', 'place', 'Name a Las Vegas casino.', `
1 Bellagio
1 Caesars Palace|Caesars
1 MGM Grand
1 The Venetian|Venetian
1 Wynn
1 Mandalay Bay
1 Luxor
1 Excalibur
1 New York-New York|New York New York
1 Paris|Paris Las Vegas
1 Flamingo
2 The Mirage|Mirage
2 Treasure Island
2 Circus Circus
2 The STRAT|Stratosphere|Strat
2 Aria
2 The Cosmopolitan|Cosmopolitan
2 Planet Hollywood
2 Harrah's|Harrahs
2 Tropicana
2 Rio
2 Palms
2 Golden Nugget
2 Horseshoe|Bally's|Ballys
2 The Linq|Linq
2 Resorts World
2 Fontainebleau
2 Sahara
2 Encore
2 Hard Rock
2 Riviera
2 Stardust
2 Sands
2 The Palazzo|Palazzo
Golden Gate
El Cortez
Fremont
Binion's
Park MGM|Monte Carlo
Westgate
Red Rock
Green Valley Ranch
South Point
The Orleans|Orleans
Gold Coast
Sam's Town
Four Queens
The D
Circa
Plaza
Downtown Grand
Durango
Virgin`),
    angle('explorers', 'history', 'people', 'Name a famous explorer.', `
1 Christopher Columbus|Columbus
1 Ferdinand Magellan|Magellan
1 Marco Polo
1 Lewis and Clark|Meriwether Lewis|William Clark|Lewis|Clark
1 Sacagawea|Sacajawea
1 Vasco da Gama
2 Amerigo Vespucci|Vespucci
2 Hernán Cortés|Hernan Cortes|Cortés|Cortez
2 Francisco Pizarro|Pizarro
2 Ponce de León|Ponce de Leon|Juan Ponce de León
2 Leif Erikson|Leif Ericson|Leif Eriksson
2 James Cook|Captain Cook|Captain James Cook
2 Roald Amundsen|Amundsen
2 Ernest Shackleton|Shackleton
2 Robert Falcon Scott
2 Edmund Hillary|Sir Edmund Hillary
2 Tenzing Norgay
2 Henry Hudson
2 Jacques Cartier
2 Samuel de Champlain|Champlain
2 Hernando de Soto|De Soto
2 Francisco Vázquez de Coronado|Coronado
2 John Cabot
2 Walter Raleigh|Sir Walter Raleigh
2 Francis Drake|Sir Francis Drake
2 Zheng He
2 Ibn Battuta
2 David Livingstone|Livingstone
2 Henry Morton Stanley
2 Daniel Boone
2 Zebulon Pike
2 Matthew Henson
2 Robert Peary|Peary
2 Amelia Earhart
2 Jacques Cousteau
Bartolomeu Dias
Juan Rodríguez Cabrillo|Cabrillo
Vitus Bering
Abel Tasman
Charles Lindbergh
Neil Armstrong
John Wesley Powell
Erik the Red
Ida Pfeiffer
Gertrude Bell
Isabella Bird
Mary Kingsley
Freya Stark
Jacques Marquette|Father Marquette
Louis Jolliet|Joliet
René-Robert de La Salle|La Salle
Juan Sebastián Elcano|Elcano
Pedro Álvares Cabral|Cabral
John Smith
George Vancouver
Alexander Mackenzie
Simon Fraser
Kit Carson`),
    angle('founders', 'history', 'people', 'Name a Founding Father.', `
1 George Washington|Washington
1 Thomas Jefferson|Jefferson
1 Benjamin Franklin|Ben Franklin|Franklin
1 John Adams
1 Alexander Hamilton|Hamilton
1 James Madison|Madison
2 John Jay|Jay
2 Samuel Adams|Sam Adams
2 John Hancock|Hancock
2 Patrick Henry
2 Thomas Paine|Paine
2 James Monroe|Monroe
2 Paul Revere
2 Gouverneur Morris
2 Robert Morris
2 George Mason|Mason
2 Roger Sherman|Sherman
2 John Dickinson|Dickinson
2 Benjamin Rush|Rush
2 Richard Henry Lee
2 Aaron Burr|Burr
2 Charles Carroll
2 Elbridge Gerry|Gerry
2 Rufus King
2 Edmund Randolph|Randolph
2 John Marshall
2 Marquis de Lafayette|Lafayette
2 Button Gwinnett
2 Caesar Rodney
Charles Pinckney
Charles Cotesworth Pinckney
James Wilson
John Witherspoon
Robert R. Livingston|Robert Livingston
Oliver Ellsworth
William Paterson
Luther Martin
Robert Treat Paine
Francis Hopkinson
Abraham Baldwin
Silas Deane
Peyton Randolph
Henry Laurens
John Rutledge
Josiah Bartlett
Stephen Hopkins
Abigail Adams
Mercy Otis Warren`),
    angle('cloud_types', 'science', 'category', 'Name a type of cloud.', `
1 Cumulus
1 Stratus
1 Cirrus
2 Cumulonimbus|Thunderhead
2 Nimbostratus|Nimbus
2 Altostratus
2 Altocumulus
2 Cirrostratus
2 Cirrocumulus
2 Stratocumulus
2 Fog
2 Contrail
2 Funnel cloud
Mammatus
Lenticular
Shelf cloud
Wall cloud
Noctilucent
Pileus
Anvil
Mackerel sky
Kelvin-Helmholtz
Asperitas`),
    angle('vitamins', 'science', 'category', 'Name a vitamin.', `
1 C|Vitamin C
1 D|Vitamin D
1 A|Vitamin A
1 B12|Vitamin B12|B-12
2 E|Vitamin E
2 K|Vitamin K
2 B6|Vitamin B6|B-6
2 B|B complex|Vitamin B
2 Biotin|B7|Vitamin B7
2 Folate|Folic acid|B9|Vitamin B9
2 Niacin|B3|Vitamin B3
2 Riboflavin|B2|Vitamin B2
2 Thiamine|Thiamin|B1|Vitamin B1
2 Pantothenic acid|B5|Vitamin B5`),
    angle('units', 'science', 'category', 'Name a unit of measurement.', `
1 Inch
1 Foot|Feet
1 Yard
1 Mile
1 Meter|Metre
1 Centimeter|Centimetre
1 Pound
1 Ounce
1 Gallon
1 Liter|Litre
1 Cup
1 Second
1 Minute
1 Hour
2 Millimeter|Millimetre
2 Kilometer|Kilometre
2 Gram
2 Kilogram|Kilo
2 Ton|Tonne
2 Milliliter|Millilitre
2 Quart
2 Pint
2 Teaspoon
2 Tablespoon
2 Degree
2 Acre
2 Hectare
2 Watt
2 Volt
2 Amp|Ampere
2 Calorie
2 Celsius
2 Fahrenheit
2 Kelvin
2 Light-year|Light year
2 Byte|Bit|Megabyte|Gigabyte|Kilobyte|Terabyte
2 Knot
2 Fluid ounce
2 Day
2 Week
2 Month
2 Year
Ohm
Joule
Newton
Pascal
Fathom
Furlong
League
Nautical mile
Hertz
Decibel
Stone
Carat|Karat
Bushel
Peck
Barrel
Cubit
Hand
Horsepower
Lumen
Mole
Parsec
Angstrom|Ångström
Micron
Psi
BTU`),
    angle('backyard_birds', 'nature', 'place', 'Name a bird you might see in a backyard.', `
1 Robin
1 Blue jay|Bluejay|Jay
1 Cardinal
1 Sparrow
1 Crow
1 Hummingbird
1 Pigeon
1 Woodpecker
2 Finch|Goldfinch|House finch
2 Chickadee
2 Mourning dove|Dove
2 Starling
2 Wren
2 Mockingbird
2 Blackbird|Red-winged blackbird
2 Oriole|Baltimore oriole
2 Bluebird
2 Nuthatch
2 Titmouse|Tufted titmouse
2 Junco
2 Grackle
2 Cowbird
2 Catbird
2 Swallow
2 Warbler
2 Owl
2 Hawk
2 Magpie
2 Thrush
2 Flicker
Thrasher
Tanager
Grosbeak
Towhee
Blue tit
Great tit
Wagtail
Kingfisher
Phoebe
Waxwing|Cedar waxwing
Vireo
Kinglet
Siskin
Bunting|Indigo bunting
Chipping sparrow
Killdeer
Quail
Wild turkey|Turkey`),
    angle('farm_animals', 'nature', 'place', 'Name an animal you\'d see on a farm.', `
1 Cow
1 Pig
1 Chicken
1 Horse
1 Sheep
1 Goat
1 Duck
1 Turkey
2 Donkey
2 Rooster
2 Goose
2 Llama
2 Alpaca
2 Rabbit
2 Mule
2 Dog
2 Cat
2 Bull
2 Ox
2 Pony
2 Hen
2 Calf
2 Lamb
2 Piglet
2 Barn owl|Owl
2 Mouse|Mice
2 Rat
2 Bee|Bees
Peacock
Guinea fowl
Emu
Ostrich
Bison|Buffalo
Yak
Water buffalo
Quail
Pheasant
Steer
Heifer
Ram
Ewe
Sow
Boar
Billy goat
Chick
Foal
Kid
Barn cat
Sheepdog
Cattle`),
    angle('zoo_animals', 'nature', 'place', 'Name an animal you\'d see at the zoo.', `
1 Lion
1 Tiger
1 Elephant
1 Giraffe
1 Zebra
1 Monkey
1 Bear
1 Penguin
1 Gorilla
1 Hippo|Hippopotamus
1 Rhino|Rhinoceros
1 Panda|Giant panda
1 Kangaroo
1 Flamingo
1 Snake
1 Chimpanzee|Chimp
2 Polar bear
2 Cheetah
2 Leopard
2 Jaguar
2 Orangutan
2 Koala
2 Seal
2 Sea lion
2 Otter
2 Alligator
2 Crocodile
2 Tortoise
2 Turtle
2 Camel
2 Ostrich
2 Peacock
2 Parrot
2 Meerkat
2 Lemur
2 Red panda
2 Sloth
2 Wolf
2 Hyena
2 Baboon
2 Bison
2 Bald eagle|Eagle
2 Owl
2 Komodo dragon
2 Tapir
2 Okapi
2 Warthog
2 Wallaby
2 Anteater
2 Armadillo
2 Porcupine
2 Capybara
2 Gibbon
2 Snow leopard
2 Bat
Llama
Emu
Iguana
Tarantula
Frog
Toucan
Pelican
Gazelle
Antelope
Elk
Moose
Reindeer
Lynx
Bobcat
Cougar|Mountain lion|Puma
Hedgehog
Wombat
Platypus
Gila monster
Chameleon
Tamarin
Mandrill
Gharial
Wildebeest
Kudu
Aardvark`),
    angle('hibernators', 'nature', 'trait', 'Name an animal that hibernates.', `
1 Bear|Black bear|Brown bear|Grizzly bear|Grizzly
1 Groundhog|Woodchuck
1 Bat
2 Chipmunk
2 Hedgehog
2 Ground squirrel|Squirrel
2 Frog|Wood frog
2 Turtle|Box turtle
2 Snake|Garter snake|Rattlesnake
2 Ladybug|Ladybird
2 Bumblebee|Bee
2 Dormouse
2 Marmot
2 Prairie dog
2 Skunk
2 Polar bear
2 Hamster
Snail
Fat-tailed dwarf lemur|Lemur
Poorwill|Common poorwill
Badger
Echidna
Alligator
Toad
Salamander
Lizard
Mosquito
Mourning cloak|Butterfly`),
    angle('black_white_animals', 'nature', 'trait', 'Name an animal that\'s black and white.', `
1 Zebra
1 Panda|Giant panda
1 Skunk
1 Penguin
1 Orca|Killer whale
1 Dalmatian
1 Cow|Holstein|Holstein cow|Dairy cow
2 Magpie
2 Badger
2 Puffin
2 Tapir|Malayan tapir
2 Border collie
2 Boston Terrier
2 Colobus monkey|Colobus
2 Loon
2 Tuxedo cat|Cat
2 Ruffed lemur|Black-and-white ruffed lemur
2 Indri
2 Black-and-white warbler
2 Avocet
2 Moorish idol
2 Osprey`),
    angle('halloween', 'holidays', 'time', 'Name something you\'d see on Halloween.', `
1 Pumpkin|Jack-o'-lantern|Jack-o-lantern|Pumpkins
1 Candy
1 Costumes|Costume
1 Ghost|Ghosts
1 Witch|Witches
1 Skeleton|Skeletons
1 Bat|Bats
1 Black cat
1 Spider|Spiders
1 Trick-or-treaters|Trick or treaters|Trick-or-treating
1 Candy corn
2 Spiderweb|Cobwebs|Spider webs|Webs
2 Zombie|Zombies
2 Vampire|Vampires|Dracula
2 Mummy|Mummies
2 Werewolf|Werewolves
2 Frankenstein
2 Scarecrow
2 Haunted house
2 Cauldron
2 Broom|Broomstick
2 Tombstone|Gravestone|Tombstones
2 Skull|Skulls
2 Owl
2 Full moon|Moon
2 Fog
2 Hayride
2 Corn maze
2 Caramel apples|Candy apples
2 Bobbing for apples
2 Masks|Mask
2 Pillowcase|Candy bag|Bucket
2 Monster|Monsters
2 Devil
2 Goblin|Goblins
Ghoul
Clown
Pirate
Porch light
Fake blood
Gourds
Hay bales
Orange lights
Inflatables
Fog machine
Fake spiders
Princess
Superhero`),
    angle('valentines', 'holidays', 'time', 'Name a Valentine\'s Day gift.', `
1 Roses|Flowers|Rose
1 Chocolate|Chocolates|Box of chocolates
1 Card|Valentine|Valentine's card
1 Jewelry
1 Teddy bear|Stuffed animal
2 Candy hearts|Conversation hearts|Sweethearts
2 Dinner|Dinner date
2 Perfume
2 Necklace
2 Wine
2 Champagne
2 Balloons
2 Lingerie
2 Love letter|Letter
2 Ring
2 Bracelet
2 Earrings
2 Candles
2 Spa day|Massage
2 Gift card
2 Chocolate-covered strawberries|Chocolate covered strawberries
2 Heart-shaped box
Watch
Cologne
Bath bombs
Poem
Playlist|Mixtape
Breakfast in bed
Photo album
Locket
Cupcakes
Cookies
Lip balm
Pajamas
Concert tickets|Tickets`),
    angle('july_fourth', 'holidays', 'time', 'Name a Fourth of July tradition.', `
1 Fireworks
1 Parade
1 Barbecue|BBQ|Cookout|Grilling
1 Hot dogs|Hot dog
1 American flag|Flag|Flags
1 Picnic
1 Sparklers
2 Hamburgers|Burgers
2 Apple pie
2 Watermelon
2 Corn on the cob
2 Potato salad
2 Lemonade
2 Beer
2 Cornhole|Lawn games
2 Concert
2 Hot dog eating contest|Nathan's hot dog eating contest
2 Red, white and blue|Red white and blue
2 Baseball game|Baseball
2 Pool party|Swimming
2 Beach
2 Bonfire
2 Ice cream
2 S'mores
2 Bunting
2 Fireworks show
Reading the Declaration of Independence|Declaration of Independence
Patriotic songs
Uncle Sam
Boat parade
Family reunion
Flag pins
Popsicles
Ribs`),
    angle('birthday_traditions', 'holidays', 'everyday', 'Name a birthday party tradition.', `
1 Cake|Birthday cake
1 Candles|Blowing out candles
1 Singing "Happy Birthday"|Happy Birthday song|Singing Happy Birthday
1 Presents|Gifts
1 Balloons
1 Party hats
1 Making a wish|Wish
2 Piñata|Pinata
2 Goody bags|Party favors|Favors
2 Games|Party games
2 Card|Birthday card
2 Streamers
2 Ice cream
2 Pin the Tail on the Donkey
2 Musical chairs
2 Bounce house
2 Confetti
2 Decorations
2 Clown
2 Magician
2 Noisemakers|Party blowers|Blowers
2 Birthday crown|Crown
2 Banner
2 Cupcakes
2 Pizza
2 Sleepover
Face painting
Birthday spankings
Dinner out
Birthday breakfast
Surprise party
Photo booth
Karaoke`),
    angle('hairstyles', 'style', 'category', 'Name a hairstyle.', `
1 Ponytail
1 Bun
1 Braid|Braids
1 Bob
1 Pixie cut|Pixie
1 Mohawk
1 Mullet
1 Buzz cut
1 Afro
1 Pigtails
2 Crew cut
2 Cornrows
2 Dreadlocks|Locs|Dreads
2 French braid
2 Fishtail braid|Fishtail
2 Bangs|Fringe
2 Beehive
2 Updo
2 Chignon
2 Top knot|Man bun
2 Fade
2 Pompadour
2 Shag
2 Layers|Layered
2 Lob
2 Perm
2 Curtain bangs
2 The Rachel|Rachel
2 Feathered
2 Box braids
2 Bantu knots
2 Comb-over|Combover
2 Undercut
2 Bowl cut
2 Flat top
2 Faux hawk|Fauxhawk
2 Space buns
2 Half-up half-down|Half up half down
2 Beach waves
Quiff
Twist out
Crown braid
Victory rolls
Finger waves
Jheri curl
Wedge
Wolf cut
Butterfly cut
Dutch braid
Waterfall braid
Sleek ponytail
Blowout
Pageboy
Ducktail
High-top fade
Frohawk
Caesar cut
Taper`),
    angle('jewelry', 'style', 'category', 'Name a piece of jewelry.', `
1 Necklace
1 Ring
1 Earrings|Earring
1 Bracelet
1 Watch
2 Brooch|Broach
2 Anklet
2 Pendant
2 Locket
2 Choker
2 Charm bracelet
2 Cufflinks
2 Tiara
2 Crown
2 Bangle
2 Hoop earrings|Hoops
2 Stud earrings|Studs
2 Engagement ring
2 Wedding band|Wedding ring
2 Nose ring
2 Belly button ring|Belly ring
2 Toe ring
2 Tie clip|Tie bar
2 Pin
2 Chain
2 Cuff
2 Signet ring
2 Class ring
2 Mood ring
2 Pearls|String of pearls|Pearl necklace
2 Tennis bracelet
2 Friendship bracelet
Ear cuff
Lapel pin
Amulet
Talisman
Medallion
Cameo
Body chain
Barrette
Hair clip
Tie pin
Circlet
Diadem
Grill|Grillz`),
    angle('fabrics', 'style', 'category', 'Name a fabric.', `
1 Cotton
1 Silk
1 Wool
1 Denim
1 Leather
1 Polyester
1 Linen
2 Velvet
2 Satin
2 Lace
2 Cashmere
2 Nylon
2 Rayon
2 Spandex|Lycra|Elastane
2 Chiffon
2 Tulle
2 Corduroy
2 Flannel
2 Fleece
2 Jersey
2 Suede
2 Tweed
2 Canvas
2 Muslin
2 Chenille
2 Gingham
2 Seersucker
2 Taffeta
2 Organza
2 Crepe
2 Twill
2 Mohair
2 Angora
2 Acrylic
2 Felt
2 Burlap
2 Terry cloth|Terrycloth
2 Microfiber
2 Velour
2 Faux fur
Alpaca
Viscose
Modal
Bamboo
Poplin
Oxford cloth|Oxford
Chambray
Gore-Tex
Brocade
Damask
Jacquard
Georgette
Voile
Batiste
Calico
Madras
Pashmina
Tencel|Lyocell
Merino
Hemp
Shearling
Tartan`),
    angle('disney_channel', 'kids', 'category', 'Name a Disney Channel show.', `
1 Hannah Montana
1 That's So Raven
1 The Suite Life of Zack & Cody|Suite Life of Zack and Cody|The Suite Life
1 Wizards of Waverly Place
1 Lizzie McGuire
1 Phineas and Ferb
1 Kim Possible
1 Good Luck Charlie
2 Even Stevens
2 Jessie
2 Austin & Ally|Austin and Ally
2 Shake It Up
2 Sonny with a Chance
2 Girl Meets World
2 Liv and Maddie
2 K.C. Undercover|KC Undercover
2 Bunk'd|Bunkd
2 Andi Mack
2 Raven's Home
2 Gravity Falls
2 The Proud Family|Proud Family
2 Recess
2 Lilo & Stitch: The Series
2 American Dragon: Jake Long|American Dragon
2 Corey in the House
2 JONAS|Jonas
2 The Famous Jett Jackson
2 Sofia the First
2 Doc McStuffins
2 Mickey Mouse Clubhouse
2 Bizaardvark
2 Stuck in the Middle
2 Best Friends Whenever
2 Dog with a Blog
2 A.N.T. Farm|ANT Farm
2 Amphibia
2 The Owl House|Owl House
2 Big City Greens
2 Kiff
2 Wizards Beyond Waverly Place
2 The Suite Life on Deck|Suite Life on Deck
2 So Weird
2 Smart Guy
2 Phil of the Future`),
    angle('nickelodeon', 'kids', 'category', 'Name a Nickelodeon show.', `
1 SpongeBob SquarePants|SpongeBob
1 Rugrats
1 iCarly
1 Drake & Josh|Drake and Josh
1 Hey Arnold!|Hey Arnold
1 The Fairly OddParents|Fairly OddParents|Fairly Odd Parents
1 Avatar: The Last Airbender|Avatar
1 Dora the Explorer|Dora
1 Blue's Clues
1 PAW Patrol|Paw Patrol
2 Victorious
2 Zoey 101
2 All That
2 Kenan & Kel|Kenan and Kel
2 Clarissa Explains It All
2 Doug
2 Rocko's Modern Life
2 The Ren & Stimpy Show|Ren and Stimpy|Ren & Stimpy
2 Jimmy Neutron|The Adventures of Jimmy Neutron
2 Danny Phantom
2 Invader Zim
2 The Wild Thornberrys|Wild Thornberrys
2 Rocket Power
2 CatDog
2 Aaahh!!! Real Monsters|Real Monsters
2 Are You Afraid of the Dark?|Are You Afraid of the Dark
2 Double Dare
2 Legends of the Hidden Temple
2 Salute Your Shorts
2 The Adventures of Pete & Pete|Pete & Pete
2 Sam & Cat|Sam and Cat
2 Big Time Rush
2 The Loud House|Loud House
2 Henry Danger
2 The Legend of Korra|Legend of Korra
2 Teenage Mutant Ninja Turtles|TMNT
2 Ned's Declassified School Survival Guide|Ned's Declassified
2 Unfabulous
2 True Jackson, VP|True Jackson
2 The Amanda Show|Amanda Show
2 Hey Dude
2 Nick Arcade
2 Figure It Out
2 The Thundermans|Thundermans
2 Game Shakers
2 Bubble Guppies
2 Wonder Pets
2 Blaze and the Monster Machines
2 You Can't Do That on Television
2 Eureeka's Castle
2 Gullah Gullah Island
2 Allegra's Window
2 The Angry Beavers|Angry Beavers
2 ChalkZone
2 My Life as a Teenage Robot
2 As Told by Ginger
2 The Mighty B
2 Back at the Barnyard
2 Fanboy & Chum Chum
2 Harvey Beaks
2 Breadwinners
2 Sanjay and Craig
2 The Penguins of Madagascar
2 Kung Fu Panda: Legends of Awesomeness
2 Nicky, Ricky, Dicky & Dawn
2 School of Rock
2 Make It Pop
2 Knight Squad
2 Danger Force
2 Side Hustle
2 Tyler Perry's Young Dylan|Young Dylan
2 The Casagrandes|Casagrandes
2 It's Pony`),
    angle('childhood_toys', 'kids', 'everyday', 'Name a toy kids have loved.', `
1 Barbie
1 LEGO|Legos|Lego
1 Slinky
1 Etch A Sketch|Etch-a-Sketch
1 Rubik's Cube
1 Hot Wheels
1 Furby
1 Tamagotchi
1 Cabbage Patch Kids|Cabbage Patch doll
1 Beanie Babies|Beanie Baby
1 Easy-Bake Oven|Easy Bake Oven
1 Play-Doh|Play Doh
1 Mr. Potato Head|Mr Potato Head
1 Teddy bear
1 Yo-yo|Yoyo
1 Hula hoop
2 Teddy Ruxpin
2 Lite-Brite|Lite Brite
2 Polly Pocket
2 My Little Pony
2 Care Bears
2 Transformers
2 G.I. Joe|GI Joe
2 Frisbee
2 Tickle Me Elmo
2 Silly Putty
2 View-Master|Viewmaster
2 Lincoln Logs
2 Tinkertoys|Tinker Toys
2 Matchbox cars|Matchbox
2 Nerf|Nerf gun
2 Super Soaker
2 Magic 8 Ball|Magic 8-Ball
2 Spirograph
2 Bop It
2 Game Boy
2 Pogs
2 Koosh ball|Koosh
2 Stretch Armstrong
2 American Girl doll|American Girl
2 Bratz
2 Pound Puppies
2 Strawberry Shortcake
2 Troll dolls|Trolls
2 Magna Doodle
2 Speak & Spell|Speak and Spell
2 K'Nex|Knex
2 Jack-in-the-box
2 Rocking horse
2 Jump rope
2 Pogo stick
2 Big Wheel
2 Skip-It
2 Fidget spinner
2 Squishmallows|Squishmallow
2 Hatchimals
2 L.O.L. Surprise!|LOL Surprise
2 Shopkins
2 Webkinz
2 Pokémon cards|Pokemon cards
2 Wooden blocks|Blocks
2 Dollhouse
2 Toy trains|Train set
2 Kites|Kite
2 Marbles
2 Jacks
2 Water balloons
2 Sidewalk chalk
2 Bubbles
2 Baby doll
2 Little People|Fisher-Price Little People
2 Chatter Telephone|Fisher-Price phone
2 Mega Bloks
Zhu Zhu Pets
Moon Shoes
Glo Worm`),
    angle('game_characters', 'games', 'people', 'Name a video game character.', `
1 Mario
1 Luigi
1 Princess Peach|Peach
1 Bowser
1 Yoshi
1 Donkey Kong
1 Link
1 Princess Zelda|Zelda
1 Sonic|Sonic the Hedgehog
1 Pac-Man|Pacman
1 Pikachu
1 Kirby
2 Master Chief
2 Lara Croft
2 Samus|Samus Aran
2 Mega Man
2 Crash Bandicoot|Crash
2 Spyro
2 Steve
2 Kratos
2 Solid Snake|Snake
2 Cloud Strife|Cloud
2 Ms. Pac-Man|Ms Pac-Man
2 Wario
2 Toad
2 Ganondorf|Ganon
2 Tails
2 Knuckles
2 Dr. Robotnik|Eggman|Dr. Eggman
2 Ryu
2 Chun-Li
2 Sub-Zero
2 Scorpion
2 Fox McCloud|Fox
2 Jigglypuff
2 Rayman
2 Frogger
2 Q*bert|Qbert
2 Nathan Drake
2 Ellie
2 Joel
2 Arthur Morgan
2 Aloy
2 Geralt|Geralt of Rivia
2 Sackboy
2 Ratchet
2 Clank
2 Banjo
2 Kazooie
2 Isabelle
2 Tom Nook
2 Pit
2 Daisy|Princess Daisy
2 Rosalina
2 Diddy Kong
2 Waluigi
2 Shadow|Shadow the Hedgehog
2 Marcus Fenix
2 Duke Nukem
2 Carmen Sandiego
2 Agent 47
2 Doomguy|Doom Slayer
2 Gordon Freeman
2 Ezio|Ezio Auditore
2 Sora
2 Inkling
2 Villager
2 Pyramid Head
2 Leon Kennedy|Leon
2 Jill Valentine
2 Chris Redfield
2 Bayonetta
2 Lucina
2 Captain Falcon
2 Ness
2 Olimar|Captain Olimar
2 Dig Dug
2 Simon Belmont
2 Dante
2 Vault Boy
2 Claptrap
2 Glados|GLaDOS
2 Chell
2 Creeper
2 Alex
2 Freddy Fazbear
2 Cuphead
2 Madeline
2 Hollow Knight|The Knight`),
    angle('arcade_games', 'games', 'time', 'Name a classic arcade game.', `
1 Pac-Man|Pacman
1 Space Invaders
1 Donkey Kong
1 Galaga
1 Asteroids
1 Frogger
1 Pong
1 Tetris
1 Street Fighter|Street Fighter II
1 Mortal Kombat
1 Ms. Pac-Man|Ms Pac-Man
2 Centipede
2 Dig Dug
2 Q*bert|Qbert
2 Missile Command
2 Defender
2 Joust
2 Tempest
2 Galaxian
2 BurgerTime|Burger Time
2 Pole Position
2 Dragon's Lair
2 Contra
2 Double Dragon
2 Gauntlet
2 Rampage
2 Teenage Mutant Ninja Turtles|TMNT
2 NBA Jam
2 Golden Tee
2 Skee-Ball|Skee Ball
2 Whac-A-Mole|Whack-a-Mole
2 Pinball
2 Dance Dance Revolution|DDR
2 Time Crisis
2 The House of the Dead|House of the Dead
2 Paperboy
2 Marble Madness
2 Robotron: 2084|Robotron
2 Spy Hunter
2 Punch-Out!!|Punch-Out
2 Bubble Bobble
2 Metal Slug
2 Out Run|OutRun
2 Crazy Taxi
2 Daytona USA
2 Big Buck Hunter
2 The Simpsons|Simpsons arcade
2 X-Men
2 Killer Instinct
2 Area 51
2 Cruis'n USA|Cruisin USA
2 San Francisco Rush
2 Hydro Thunder
2 Tron
2 Battlezone
2 Berzerk
2 Breakout
2 Lunar Lander
2 Pengo
2 Mappy
2 Rally-X|Rally X
2 1942
2 Xevious
2 Arkanoid
2 Bomb Jack
2 Kung-Fu Master
2 Yie Ar Kung-Fu
2 Golden Axe
2 Final Fight
2 Rygar
2 Ghosts 'n Goblins|Ghosts n Goblins
2 Elevator Action
2 Moon Patrol
2 Zaxxon
2 Track & Field|Track and Field
2 Hyper Sports
2 Excitebike
2 Duck Hunt
2 Pac-Mania
Tapper`),
    angle('hanks_movies', 'movies', 'people', 'Name a movie starring Tom Hanks.', `
1 Forrest Gump
1 Toy Story
1 Saving Private Ryan
1 The Green Mile
1 Catch Me If You Can
1 The Da Vinci Code
1 Toy Story 2
1 Toy Story 3
1 Cast Away
1 Apollo 13
1 The Terminal
1 Angels & Demons|Angels and Demons
1 Toy Story 4
1 Bridge of Spies
1 Captain Phillips
1 Philadelphia
2 Sleepless in Seattle
2 Inferno
2 Cloud Atlas
2 You've Got Mail
2 Road to Perdition
2 Sully
2 The Polar Express
2 The Post
2 Elvis
2 Big
2 Extremely Loud and Incredibly Close
2 Saving Mr. Banks
2 Charlie Wilson's War
2 Asteroid City
2 Toy Story 5
3 A League of Their Own
3 Larry Crowne
3 The Ladykillers
3 Splash
3 A Man Called Otto
3 Borat Subsequent Moviefilm
3 The Circle
3 Greyhound
3 The Money Pit
3 The Bonfire of the Vanities
3 News of the World
3 Pinocchio
3 Joe Versus the Volcano
3 A Beautiful Day in the Neighborhood
3 Turner & Hooch|Turner and Hooch
3 The Phoenician Scheme
3 Bachelor Party
3 A Hologram for the King
3 Here
3 The 'Burbs
4 That Thing You Do!|That Thing You Do
4 The Man with One Red Shoe
4 Dragnet
4 Radio Flyer
4 Volunteers
4 Finch
4 The Great Buck Howard
4 Nothing in Common
4 He Knows You're Alone
4 Punchline
4 Every Time We Say Goodbye
4 Ithaca
5 Freaky Tales`),
    angle('roberts_movies', 'movies', 'people', 'Name a movie starring Julia Roberts.', `
1 Pretty Woman
1 Ocean's Eleven
1 Notting Hill
1 Erin Brockovich
2 Charlotte's Web
2 Closer
2 Ocean's Twelve
2 Mona Lisa Smile
2 Valentine's Day
2 Hook
2 Eat Pray Love
2 My Best Friend's Wedding
2 Charlie Wilson's War
2 Mirror Mirror
2 Wonder
2 The Pelican Brief
2 Runaway Bride
3 August: Osage County|August
3 Everyone Says I Love You
3 Steel Magnolias
3 Sleeping with the Enemy
3 Confessions of a Dangerous Mind
3 Larry Crowne
3 Money Monster
3 The Mexican
3 The Player
3 Conspiracy Theory
3 Flatliners
3 America's Sweethearts
3 Prêt-à-Porter
3 Mystic Pizza
3 Stepmom
3 Michael Collins
3 Ticket to Paradise
3 Duplicity
3 Leave the World Behind
3 I Love Trouble
3 Something to Talk About
3 The Secret in Their Eyes
3 Dying Young
3 Mother's Day
4 Fireflies in the Garden
4 Mary Reilly
4 After the Hunt
4 Ben Is Back
4 The Normal Heart
4 Full Frontal
4 Love, Wedding, Marriage
5 Satisfaction
5 Grand Champion`),
    angle('streep_movies', 'movies', 'people', 'Name a movie starring Meryl Streep.', `
1 The Deer Hunter
1 Kramer vs. Kramer
1 Out of Africa
1 Fantastic Mr. Fox
1 A.I. Artificial Intelligence
1 The Devil Wears Prada
1 Mamma Mia!|Mamma Mia
1 The Hours
2 Manhattan
2 The Bridges of Madison County
2 Death Becomes Her
2 Don't Look Up
2 The Iron Lady
2 Mary Poppins Returns
2 Little Women
2 Into the Woods
2 The Post
2 Lemony Snicket's A Series of Unfortunate Events
2 Adaptation
2 Doubt
2 Julie & Julia|Julie and Julia
2 Sophie's Choice
2 Mamma Mia! Here We Go Again
2 Marvin's Room
2 Julia
3 August: Osage County|August
3 The Manchurian Candidate
3 Silkwood
3 The Devil Wears Prada 2
3 Postcards from the Edge
3 The French Lieutenant's Woman
3 Lions for Lambs
3 The River Wild
3 It's Complicated
3 The Giver
3 Florence Foster Jenkins
3 The House of the Spirits
3 Rendition
3 Heartburn
3 She-Devil
3 One True Thing
3 Evil Angels
3 The Prom
3 Music of the Heart
3 The Laundromat
3 A Prairie Home Companion
3 Prime
3 The Homesman
3 Suffragette
3 Hope Springs
3 Falling in Love
3 Ironweed
3 Defending Your Life
4 Stuck on You
4 Evening
4 Before and After
4 Still of the Night
4 Ricki and the Flash
4 Let Them All Talk
4 Dancing at Lughnasa
4 Plenty
4 The Seduction of Joe Tynan
4 Dark Matter`),
    angle('bullock_movies', 'movies', 'people', 'Name a movie starring Sandra Bullock.', `
1 Gravity
1 Minions
1 Crash
1 Speed
2 The Proposal
2 The Blind Side
2 Demolition Man
2 Bullet Train
2 The Lake House
2 Extremely Loud and Incredibly Close
2 Ocean's 8
2 Miss Congeniality
2 Bird Box
2 Practical Magic
2 28 Days
2 The Net
2 A Time to Kill
3 While You Were Sleeping
3 The Heat
3 Miss Congeniality 2: Armed and Fabulous|Miss Congeniality 2
3 Two Weeks Notice
3 Murder by Numbers
3 All About Steve
3 Speed 2: Cruise Control|Speed 2
3 Premonition
3 The Lost City
3 Infamous
3 The Vanishing
3 Our Brand Is Crisis
3 Forces of Nature
3 In Love and War
3 Divine Secrets of the Ya-Ya Sisterhood
3 Practical Magic 2
4 The Unforgivable
4 Hope Floats
4 The Thing Called Love
4 Love Potion No. 9
4 Wrestling Ernest Hemingway
4 Two If by Sea
4 Gun Shy
4 Fire on the Amazon
4 Loverboy
4 Who Do I Gotta Kill?
4 Hangmen
5 When the Party's Over`),
    angle('denzel_movies', 'movies', 'people', 'Name a movie starring Denzel Washington.', `
1 Philadelphia
1 American Gangster
2 Gladiator II
2 Training Day
2 Déjà Vu
2 The Book of Eli
2 The Equalizer
2 Man on Fire
2 Inside Man
2 Flight
2 The Pelican Brief
2 Glory
3 The Bone Collector
3 The Manchurian Candidate
3 Unstoppable
3 Crimson Tide
3 The Magnificent Seven
3 Fences
3 John Q
3 Malcolm X
3 Safe House
3 2 Guns
3 The Hurricane
3 Remember the Titans
3 The Equalizer 2
3 The Little Things
3 The Taking of Pelham 123
3 The Siege
3 Cry Freedom
3 Out of Time
3 The Equalizer 3
3 Courage Under Fire
3 Virtuosity
3 A Soldier's Story
3 Fallen
3 Roman J. Israel, Esq.
3 Ricochet
3 The Great Debaters
3 Much Ado About Nothing
3 The Preacher's Wife
4 He Got Game
4 The Tragedy of Macbeth
4 Devil in a Blue Dress
4 Power
4 Mo' Better Blues
4 Mississippi Masala
4 Highest 2 Lowest
4 Antwone Fisher
4 Heart Condition
4 Carbon Copy
4 The Mighty Quinn
4 For Queen and Country
5 The Take`),
    angle('will_smith_movies', 'movies', 'people', 'Name a movie starring Will Smith.', `
1 Independence Day
1 Suicide Squad
1 Men in Black
1 Aladdin
1 I Am Legend
1 I, Robot
1 The Pursuit of Happyness
1 Shark Tale
2 Men in Black II
2 Men in Black 3
2 Hancock
2 Hitch
2 Bad Boys
2 Wild Wild West
2 After Earth
2 Seven Pounds
2 Enemy of the State
2 Ali
2 Focus
2 Bad Boys for Life
3 Bad Boys II
3 Collateral Beauty
3 Bad Boys: Ride or Die|Bad Boys
3 King Richard
3 Jersey Girl
3 Gemini Man
3 The Legend of Bagger Vance
3 Anchorman 2: The Legend Continues|Anchorman 2
3 Spies in Disguise
3 Concussion
3 Winter's Tale
3 Made in America
3 Bright
4 Emancipation
4 Six Degrees of Separation
4 Where the Day Takes You
4 Hampstead`),
    angle('dicaprio_movies', 'movies', 'people', 'Name a movie starring Leonardo DiCaprio.', `
1 Titanic
1 Inception
1 The Departed
1 Catch Me If You Can
1 The Wolf of Wall Street
1 Django Unchained
1 The Revenant
1 Shutter Island
1 Once Upon a Time in Hollywood
1 Gangs of New York
1 The Aviator
1 Blood Diamond
1 The Great Gatsby
2 One Battle After Another
2 The Beach
2 Don't Look Up
2 Killers of the Flower Moon
2 What's Eating Gilbert Grape
2 Body of Lies
2 The Quick and the Dead
2 J. Edgar
2 The Man in the Iron Mask
2 Revolutionary Road
2 Romeo + Juliet
2 This Boy's Life
2 Marvin's Room
2 The Basketball Diaries
2 Total Eclipse
3 Celebrity
3 Critters 3
3 Poison Ivy
3 The 11th Hour
3 Before the Flood
3 Don's Plum`),
    angle('witherspoon_movies', 'movies', 'people', 'Name a movie starring Reese Witherspoon.', `
1 American Psycho
1 Sing
2 Walk the Line
2 Legally Blonde
2 Monsters vs. Aliens
2 Cruel Intentions
2 Inherent Vice
2 Sing 2
3 Wild
3 Just like Heaven
3 Water for Elephants
3 Pleasantville
3 This Means War
3 Legally Blonde 2: Red, White & Blonde|Legally Blonde 2|Legally Blonde 2: Red, White and Blonde
3 Sweet Home Alabama
3 How Do You Know
3 Mud
3 Four Christmases
3 A Wrinkle in Time
3 Rendition
3 Vanity Fair
3 Little Nicky
3 Election
3 The Incredible Burt Wonderstone
3 Hot Pursuit
3 Penelope
3 Fear
3 The Man in the Moon
4 Twilight
4 The Importance of Being Earnest
4 Freeway
4 Home Again
4 A Far Off Place
4 The Good Lie
4 Devil's Knot
4 Your Place or Mine
4 S.F.W.
4 Jack the Bear
4 You're Cordially Invited
4 Overnight Delivery
4 Best Laid Plans`),
    angle('aniston_movies', 'movies', 'people', 'Name a movie starring Jennifer Aniston.', `
1 Bruce Almighty
2 The Iron Giant
2 We're the Millers
2 Just Go with It
2 He's Just Not That Into You
2 Horrible Bosses
2 Marley & Me|Marley and Me
3 The Bounty Hunter
3 Along Came Polly
3 The Switch
3 Horrible Bosses 2
3 Wanderlust
3 The Break-Up
3 Office Space
3 Office Christmas Party
3 Murder Mystery
3 Rumor Has It
3 Leprechaun
3 Love Happens
3 The Good Girl
3 She's the One
3 Derailed
3 Mother's Day
4 The Object of My Affection
4 Rock Star
4 Friends with Money
4 Cake
4 She's Funny That Way
4 Management
4 Picture Perfect
4 Mac and Me
4 Dumplin'
4 Murder Mystery 2
4 Life of Crime
4 'Til There Was You
4 The Yellow Birds
4 Dream for an Insomniac`),
    angle('sandler_movies', 'movies', 'people', 'Name a movie starring Adam Sandler.', `
1 Hotel Transylvania
2 50 First Dates
2 Click
2 Pixels
2 Just Go with It
2 Grown Ups
2 You Don't Mess with the Zohan
2 Hotel Transylvania 2
3 Anger Management
3 Big Daddy
3 Happy Gilmore
3 The Hot Chick
3 Grown Ups 2
3 Blended
3 Hotel Transylvania 3: Summer Vacation|Hotel Transylvania 3
3 Uncut Gems
3 I Now Pronounce You Chuck and Larry
3 Jack and Jill
3 The Longest Yard
3 Bedtime Stories
3 Mr. Deeds
3 That's My Boy
3 Funny People
3 Spanglish
3 Murder Mystery
3 Little Nicky
3 Punch-Drunk Love
3 Reign Over Me
3 The Wedding Singer
3 Jay Kelly
3 Airheads
3 Coneheads
3 Billy Madison
3 The Waterboy
3 The Animal
3 Spaceman
3 Deuce Bigalow: Male Gigolo|Deuce Bigalow
4 The Cobbler
4 Deuce Bigalow: European Gigolo|Deuce Bigalow
4 Men, Women & Children|Men, Women and Children
4 Hubie Halloween
4 Hustle
4 Happy Gilmore 2
4 The Ridiculous 6
4 Bulletproof
4 The Meyerowitz Stories
4 Eight Crazy Nights
4 Leo
4 Bucky Larson: Born to Be a Star|Bucky Larson
4 Mixed Nuts
4 The Do-Over
4 Murder Mystery 2
4 Top Five
4 Sandy Wexler
4 The Week Of
4 You Are So Not Invited to My Bat Mitzvah
4 Dirty Work
4 Going Overboard
5 Shakes the Clown`),
    angle('best_actress', 'awards', 'people', 'Name an actress who won the Oscar for best actress.', `
1 Audrey Hepburn
1 Elizabeth Taylor|Taylor
1 Natalie Portman|Portman
1 Meryl Streep|Streep
1 Nicole Kidman|Kidman
1 Cate Blanchett|Blanchett
1 Kate Winslet|Winslet
1 Julia Roberts|Roberts
1 Sophia Loren|Loren
1 Gwyneth Paltrow|Paltrow
1 Katharine Hepburn
1 Sandra Bullock|Bullock
1 Ingrid Bergman|Bergman
1 Jane Fonda|Fonda
1 Jennifer Lawrence|Lawrence
1 Halle Berry|Berry
1 Grace Kelly|Kelly
1 Cher
1 Charlize Theron|Theron
1 Jodie Foster|Foster
1 Emma Stone|Stone
1 Barbra Streisand|Streisand
1 Bette Davis|Davis
1 Vivien Leigh|Leigh
1 Julianne Moore|Moore
1 Joan Crawford|Crawford
1 Susan Sarandon|Sarandon
1 Reese Witherspoon|Witherspoon
1 Helen Mirren|Mirren
1 Mary Pickford|Pickford
1 Diane Keaton|Keaton
1 Maggie Smith|Smith
1 Julie Andrews|Andrews
1 Liza Minnelli|Minnelli
1 Shirley MacLaine|MacLaine
1 Marion Cotillard|Cotillard
1 Renée Zellweger|Zellweger
1 Hilary Swank|Swank
1 Sally Field|Field
1 Brie Larson|Larson
1 Jessica Lange|Lange
1 Emma Thompson|Thompson
1 Glenda Jackson|Jackson
1 Claudette Colbert|Colbert
1 Olivia de Havilland|Havilland
1 Kathy Bates|Bates
1 Anne Bancroft|Bancroft
1 Frances McDormand|McDormand
1 Ginger Rogers|Rogers
1 Michelle Yeoh|Yeoh
1 Jessica Chastain|Chastain
1 Joan Fontaine|Fontaine
1 Simone Signoret|Signoret
1 Faye Dunaway|Dunaway
1 Julie Christie|Christie
1 Helen Hunt|Hunt
1 Anna Magnani|Magnani
1 Holly Hunter|Hunter
1 Ellen Burstyn|Burstyn
1 Helen Hayes|Hayes
1 Patricia Neal|Neal
1 Marlee Matlin|Matlin
1 Joanne Woodward|Woodward
1 Olivia Colman|Colman
1 Jane Wyman|Wyman
1 Sissy Spacek|Spacek
1 Louise Fletcher|Fletcher
1 Janet Gaynor|Gaynor
1 Loretta Young|Young
1 Luise Rainer|Rainer
1 Norma Shearer|Shearer
1 Jennifer Jones|Jones
1 Mikey Madison|Madison
1 Jessica Tandy|Tandy
1 Susan Hayward|Hayward
1 Shirley Booth|Booth
1 Greer Garson|Garson
1 Geraldine Page|Page
1 Judy Holliday|Holliday
1 Marie Dressler|Dressler
2 Jessie Buckley|Buckley`),
    angle('best_actor', 'awards', 'people', 'Name an actor who won the Oscar for best actor.', `
1 Marlon Brando|Brando
1 Leonardo DiCaprio|DiCaprio
1 Robert De Niro|Niro
1 Tom Hanks|Hanks
1 Will Smith|Smith
1 Al Pacino|Pacino
1 Jack Nicholson|Nicholson
1 Russell Crowe|Crowe
1 Bing Crosby|Crosby
1 John Wayne|Wayne
1 Anthony Hopkins|Hopkins
1 Nicolas Cage|Cage
1 Humphrey Bogart|Bogart
1 Denzel Washington|Washington
1 Paul Newman|Newman
1 Clark Gable|Gable
1 Dustin Hoffman
1 Daniel Day-Lewis|Day-Lewis
1 Gary Oldman|Oldman
1 Sidney Poitier|Poitier
1 Jon Voight|Voight
1 Henry Fonda|Fonda
1 Sean Penn|Penn
1 Michael Douglas|Douglas
1 Gregory Peck|Peck
1 James Stewart|Stewart
1 Gary Cooper|Cooper
1 Laurence Olivier|Olivier
1 Charlton Heston|Heston
1 Robert Duvall|Duvall
1 Matthew McConaughey|McConaughey
1 James Cagney|Cagney
1 Philip Seymour Hoffman
1 Joaquin Phoenix|Phoenix
1 Kevin Spacey|Spacey
1 Cillian Murphy|Murphy
1 Roberto Benigni|Benigni
1 Spencer Tracy|Tracy
1 Jeremy Irons|Irons
1 Ben Kingsley|Kingsley
1 Gene Hackman|Hackman
1 Colin Firth|Firth
1 Jeff Bridges|Bridges
1 Burt Lancaster|Lancaster
1 Brendan Fraser|Fraser
1 Jamie Foxx|Foxx
1 Alec Guinness|Guinness
1 Forest Whitaker|Whitaker
1 Rami Malek|Malek
1 Jack Lemmon|Lemmon
1 Eddie Redmayne|Redmayne
1 Adrien Brody|Brody
1 Geoffrey Rush|Rush
1 Ernest Borgnine|Borgnine
1 Maximilian Schell|Schell
1 William Hurt|Hurt
1 William Holden|Holden
1 Yul Brynner|Brynner
1 Jean Dujardin|Dujardin
1 Casey Affleck|Affleck
1 Richard Dreyfuss|Dreyfuss
1 David Niven|Niven
1 Lee Marvin|Marvin
1 Charles Laughton|Laughton
1 F. Murray Abraham|Abraham
1 George C. Scott|Scott
1 Rod Steiger|Steiger
1 Michael B. Jordan|Jordan
1 Emil Jannings|Jannings
1 Rex Harrison|Harrison
1 Fredric March|March
1 Lionel Barrymore|Barrymore
1 Paul Muni|Muni
1 Peter Finch|Finch
1 Ray Milland|Milland
1 Art Carney|Carney
1 Cliff Robertson|Robertson
1 Broderick Crawford|Crawford
1 Paul Scofield|Scofield
2 George Arliss|Arliss
2 Warner Baxter|Baxter
2 José Ferrer|Ferrer
2 Robert Donat|Donat
2 Ronald Colman|Colman
2 Paul Lukas|Lukas
2 Wallace Beery|Beery
2 Victor McLaglen|McLaglen`),
    angle('supporting_actress', 'awards', 'people', 'Name a winner of the Oscar for best supporting actress.', `
1 Angelina Jolie|Jolie
1 Meryl Streep|Streep
1 Cate Blanchett|Blanchett
1 Ingrid Bergman|Bergman
1 Penélope Cruz|Cruz
1 Anne Hathaway|Hathaway
1 Whoopi Goldberg|Goldberg
1 Catherine Zeta-Jones|Zeta-Jones
1 Judi Dench|Dench
1 Maggie Smith|Smith
1 Renée Zellweger|Zellweger
1 Kim Basinger|Basinger
1 Rachel Weisz|Weisz
1 Jessica Lange|Lange
1 Jennifer Connelly|Connelly
1 Juliette Binoche|Binoche
1 Goldie Hawn|Hawn
1 Zoe Saldaña|Saldaña
1 Viola Davis
1 Jamie Lee Curtis|Curtis
1 Lupita Nyong'o|Nyong'o
1 Geena Davis
1 Alicia Vikander|Vikander
1 Laura Dern|Dern
1 Vanessa Redgrave|Redgrave
1 Tilda Swinton|Swinton
1 Helen Hayes|Hayes
1 Jennifer Hudson|Hudson
1 Patricia Arquette|Arquette
1 Anjelica Huston|Huston
1 Anne Baxter|Baxter
1 Anna Paquin|Paquin
1 Marisa Tomei|Tomei
1 Mira Sorvino|Sorvino
1 Shelley Winters|Winters
1 Octavia Spencer|Spencer
1 Mary Astor|Astor
1 Hattie McDaniel|McDaniel
1 Allison Janney|Janney
1 Rita Moreno|Moreno
1 Melissa Leo
1 Mary Steenburgen|Steenburgen
1 Donna Reed|Reed
1 Cloris Leachman|Leachman
1 Teresa Wright|Wright
1 Patty Duke|Duke
1 Dianne Wiest|Wiest
1 Ethel Barrymore|Barrymore
1 Eva Marie Saint|Saint
1 Marcia Gay Harden|Harden
1 Olympia Dukakis|Dukakis
1 Regina King|King
1 Dorothy Malone|Malone
1 Maureen Stapleton|Stapleton
2 Gloria Grahame|Grahame
2 Shirley Jones|Jones
2 Peggy Ashcroft|Ashcroft
2 Ruth Gordon|Gordon
2 Lee Grant|Grant
2 Alice Brady|Brady
2 Mercedes McCambridge|McCambridge
2 Fay Bainter|Bainter
2 Margaret Rutherford|Rutherford
2 Linda Hunt|Hunt
2 Claire Trevor|Trevor
2 Kim Hunter|Hunter
2 Celeste Holm|Holm
2 Jane Darwell|Darwell
2 Mercedes Ruehl|Ruehl
2 Katina Paxinou|Paxinou
2 Mo'Nique
2 Brenda Fricker|Fricker
2 Wendy Hiller|Hiller
2 Gale Sondergaard|Sondergaard
2 Josephine Hull|Hull
2 Jo Van Fleet|Fleet
2 Tatum O'Neal|O'Neal
2 Miyoshi Umeki|Umeki
2 Amy Madigan|Madigan
2 Anne Revere|Revere
2 Ariana DeBose|DeBose
2 Sandy Dennis|Dennis
2 Estelle Parsons|Parsons
2 Lila Kedrova|Kedrova
2 Beatrice Straight|Straight
2 Eileen Heckart|Heckart
3 Youn Yuh-jung|Yuh-jung
3 Da'Vine Joy Randolph|Randolph`),
    angle('animated_oscar', 'awards', 'crossover', 'Name a movie that won the Oscar for best animated feature.', `
1 Shrek
1 Frozen
1 Spirited Away
1 WALL-E
1 Zootopia
1 Encanto
1 Finding Nemo
1 Ratatouille
1 Toy Story 3
1 Inside Out
1 Up
1 The Incredibles
1 Big Hero 6
1 Brave
1 Toy Story 4
1 Coco
1 Spider-Man: Into the Spider-Verse|Spider-Man
1 Soul
1 Rango
1 Happy Feet
1 Wallace & Gromit: The Curse of the Were-Rabbit|Wallace & Gromit|Wallace and Gromit: The Curse of the Were-Rabbit
1 KPop Demon Hunters
2 The Boy and the Heron
2 Flow
2 Guillermo del Toro's Pinocchio`),
    angle('sevens', 'words', 'crossover', 'Name something there are seven of.', `
1 Days of the week|Days|Week
1 Dwarfs|Seven Dwarfs
1 Deadly sins|Sins|Seven deadly sins
1 Wonders of the world|Wonders|Seven Wonders
1 Continents
1 Seas|Seven seas
1 Colors of the rainbow|Rainbow|Colors
2 Notes in a scale|Notes|Musical notes
2 Harry Potter books|Harry Potter
2 Narnia books|Chronicles of Narnia
2 Hills of Rome|Seven hills
2 Brides for Seven Brothers
2 Samurai|Seven Samurai
2 Chakras
2 Sisters|Seven Sisters|Pleiades
2 Habits|Seven Habits of Highly Effective People
2 Swans a-swimming
2 Sacraments
2 Archangels
2 Wonders of the Ancient World
4 Virtues|Heavenly virtues
4 Liberal arts
4 Kingdoms|Seven Kingdoms
4 Seals|Seven seals`),
    angle('not_green_veg', 'food', 'trait', 'Name a vegetable that isn\'t green.', `
1 Carrot|Carrots
1 Corn
1 Potato|Potatoes
1 Tomato|Tomatoes
1 Onion|Onions
2 Beet|Beets
2 Cauliflower
2 Sweet potato|Yam
2 Pumpkin
2 Red pepper|Yellow pepper|Orange pepper|Bell pepper
2 Radish|Radishes
2 Eggplant
2 Turnip
2 Parsnip
2 Mushroom|Mushrooms
2 Squash|Butternut squash|Yellow squash
2 Red cabbage|Purple cabbage
2 Garlic
Rutabaga
Red onion
White asparagus
Jicama
Daikon
Shallot
Purple carrot
Taro
Cassava|Yuca
Rhubarb`),
    angle('disney_rides', 'geo', 'place', 'Name a ride at a Disney park.', `
1 Space Mountain
1 Splash Mountain
1 It's a Small World|Small World
1 Pirates of the Caribbean
1 Haunted Mansion
1 Big Thunder Mountain Railroad|Big Thunder Mountain|Big Thunder
1 Mad Tea Party|Teacups|Tea Cups
2 Tower of Terror|The Twilight Zone Tower of Terror
2 Matterhorn Bobsleds|Matterhorn
2 Dumbo the Flying Elephant|Dumbo
2 Peter Pan's Flight|Peter Pan
2 Jungle Cruise
2 Soarin'|Soarin
2 Expedition Everest
2 Test Track
2 Rock 'n' Roller Coaster
2 Seven Dwarfs Mine Train
2 Star Wars: Rise of the Resistance|Rise of the Resistance
2 Millennium Falcon: Smugglers Run|Smugglers Run
2 Indiana Jones Adventure
2 Toy Story Mania!|Toy Story Mania
2 Slinky Dog Dash
2 Guardians of the Galaxy: Cosmic Rewind|Cosmic Rewind
2 Tiana's Bayou Adventure
2 Avatar Flight of Passage|Flight of Passage
2 Spaceship Earth
2 Kilimanjaro Safaris
2 Buzz Lightyear's Space Ranger Spin|Buzz Lightyear
2 Mickey & Minnie's Runaway Railway|Runaway Railway
2 Radiator Springs Racers
2 Incredicoaster
2 TRON Lightcycle / Run|TRON Lightcycle Run|Tron
2 Remy's Ratatouille Adventure|Ratatouille ride
2 Frozen Ever After
2 Winnie the Pooh|The Many Adventures of Winnie the Pooh
2 Autopia
2 Carousel|Prince Charming Regal Carrousel|King Arthur Carrousel
2 Monorail
Alice in Wonderland
Mr. Toad's Wild Ride
Snow White's Enchanted Wish
Pinocchio's Daring Journey
Casey Jr. Circus Train
Storybook Land Canal Boats
Astro Orbiter
Tomorrowland Speedway
PeopleMover|Tomorrowland Transit Authority PeopleMover
Country Bear Jamboree
Enchanted Tiki Room
Mission: SPACE|Mission Space
Kali River Rapids
Na'vi River Journey
Dinosaur
Star Tours
Gran Fiesta Tour
Living with the Land
Journey into Imagination
Grizzly River Run
Goofy's Sky School
Pixar Pal-A-Round|Mickey's Fun Wheel
Haunted Mansion Holiday`),
    angle('pairs', 'home', 'everyday', 'Name something that comes in pairs.', `
1 Shoes
1 Socks
1 Gloves
1 Earrings
1 Twins
1 Eyes
1 Ears
1 Glasses|Eyeglasses|Sunglasses
2 Mittens
2 Pants|Jeans|Trousers
2 Scissors
2 Chopsticks
2 Dice
2 Skis
2 Boots
2 Hands
2 Feet
2 Legs
2 Arms
2 Lungs
2 Kidneys
2 Headphones|Earbuds
2 Contact lenses|Contacts
2 Salt and pepper shakers|Salt and pepper
2 Speakers
2 Oars
2 Drumsticks
2 Knitting needles
2 Cufflinks
2 Pliers
2 Tweezers
2 Bookends
2 Binoculars
2 Dumbbells
2 Wings
2 Skates|Roller skates|Ice skates
Pillowcases
Candlesticks
Maracas
Cymbals
Tongs
Wedding rings
Sneakers
Slippers
Hiking poles|Ski poles`),
    angle('eggs_ways', 'food', 'everyday', 'Name a way to cook an egg.', `
1 Scrambled
1 Fried
1 Hard-boiled|Hard boiled|Boiled
1 Poached
1 Over easy
1 Sunny side up
1 Omelet|Omelette
2 Soft-boiled|Soft boiled
2 Over medium
2 Over hard
2 Deviled
2 Baked|Shirred
2 Eggs Benedict
2 Frittata
2 Basted
2 Coddled
2 Quiche
2 Egg salad
2 Egg drop|Egg drop soup
2 Pickled
2 Microwaved
Steamed
Huevos rancheros
Shakshuka
Egg in a hole|Toad in the hole|Egg in a basket
Tamagoyaki
Soufflé|Souffle
Scotch egg
Sous vide`),
    angle('london_sights', 'geo', 'place', 'Name a famous sight in London.', `
1 Big Ben
1 Tower Bridge
1 Tower of London
1 Buckingham Palace
1 London Eye
1 Westminster Abbey
1 Houses of Parliament|Palace of Westminster|Parliament
2 St. Paul's Cathedral|St Paul's Cathedral|St. Paul's
2 Trafalgar Square
2 Piccadilly Circus
2 British Museum
2 Hyde Park
2 London Bridge
2 The Shard|Shard
2 Covent Garden
2 Natural History Museum
2 Tate Modern
2 National Gallery
2 Kensington Palace
2 Abbey Road
2 Camden Market|Camden
2 Oxford Street
2 Harrods
2 Downing Street|10 Downing Street
2 Madame Tussauds
2 Shakespeare's Globe|The Globe|Globe Theatre
2 Borough Market
2 Notting Hill
2 Wembley Stadium|Wembley
2 Regent's Park
2 Victoria and Albert Museum|V&A
2 Science Museum
2 Millennium Bridge
2 Leicester Square
2 Greenwich|Royal Observatory
2 Kew Gardens
2 The Gherkin|Gherkin
2 Cutty Sark
Hampton Court Palace
Windsor Castle
Platform 9¾|Platform 9 3/4
St. James's Park
Marble Arch
Carnaby Street
Portobello Road
Sky Garden
Churchill War Rooms
Royal Albert Hall
Wimbledon
Battersea Power Station
O2 Arena|The O2
Changing of the Guard`),
    angle('hats', 'style', 'category', 'Name a kind of hat.', `
1 Baseball cap|Cap|Ball cap
1 Cowboy hat
1 Top hat
1 Beanie
1 Beret
1 Sombrero
1 Fedora
2 Bowler|Derby
2 Fez
2 Panama hat|Panama
2 Bucket hat
2 Sun hat
2 Visor
2 Trucker hat
2 Stetson
2 Newsboy cap|Newsboy
2 Fascinator
2 Pillbox`),
    angle('power_tools', 'home', 'category', 'Name a power tool.', `
1 Drill|Power drill|Cordless drill
1 Chainsaw
1 Circular saw
1 Jigsaw
1 Sander|Belt sander|Orbital sander
2 Table saw
2 Miter saw|Chop saw
2 Nail gun
2 Router
2 Angle grinder|Grinder
2 Impact driver
2 Reciprocating saw|Sawzall
2 Leaf blower
2 Hedge trimmer
2 Weed eater|String trimmer|Weed whacker
2 Lawn mower|Lawnmower
2 Heat gun
2 Band saw
2 Drill press
2 Staple gun
2 Pressure washer|Power washer
2 Rotary tool|Dremel
2 Hammer drill
2 Planer
2 Glue gun|Hot glue gun
Scroll saw
Oscillating tool|Multi-tool
Jackhammer
Air compressor
Shop vac|Wet/dry vac
Tile saw
Biscuit joiner
Snowblower
Soldering iron`),
    angle('fruit_salad', 'food', 'everyday', 'Name a fruit you\'d find in a fruit salad.', `
1 Grapes|Grape
1 Strawberries|Strawberry
1 Pineapple
1 Watermelon
1 Cantaloupe
1 Apple|Apples
1 Banana|Bananas
1 Orange|Oranges
2 Blueberries|Blueberry
2 Honeydew
2 Kiwi
2 Mango
2 Peach|Peaches
2 Raspberries|Raspberry
2 Blackberries|Blackberry
2 Cherries|Cherry
2 Pear|Pears
2 Mandarin oranges|Mandarin|Clementine|Tangerine
2 Papaya
2 Pomegranate
2 Plum
2 Nectarine
2 Apricot
Dragon fruit
Star fruit|Starfruit
Passion fruit
Lychee
Guava
Fig
Coconut
Maraschino cherries
Grapefruit`),
    angle('ballpark_snacks', 'food', 'place', 'Name a snack you\'d buy at a ballpark.', `
1 Hot dog|Hot dogs
1 Popcorn
1 Peanuts
1 Nachos
1 Pretzel|Soft pretzel
1 Cracker Jack
1 Beer
2 Cotton candy
2 Soda|Pop|Coke
2 Ice cream|Ice cream sandwich|Dippin' Dots
2 Sunflower seeds|Seeds
2 French fries|Fries
2 Hamburger|Burger
2 Pizza
2 Chicken tenders|Chicken fingers
2 Churros|Churro
2 Candy
2 Bratwurst|Brats|Sausage
2 Funnel cake
2 Garlic fries
2 Water
2 Lemonade
Corn dog
Italian ice
Cheesesteak
Crab fries
Fried dough
Kettle corn
Malt cup
Fish tacos
Elote`),
    angle('talking_animal_movies', 'movies', 'trait', 'Name a movie with talking animals.', `
1 The Lion King|Lion King
1 Babe
1 Charlotte's Web
1 Finding Nemo
1 Madagascar
1 Zootopia
1 Shrek
1 Dr. Dolittle|Doctor Dolittle
1 Ice Age
1 Kung Fu Panda
2 Finding Dory
2 Bambi
2 Dumbo
2 Lady and the Tramp
2 101 Dalmatians|One Hundred and One Dalmatians
2 The Jungle Book|Jungle Book
2 Homeward Bound
2 Chicken Run
2 Bee Movie
2 Ratatouille
2 Stuart Little
2 Paddington
2 Fantastic Mr. Fox
2 The Secret Life of Pets
2 Sing
2 Rio
2 Bolt
2 Over the Hedge
2 Robin Hood
2 The Aristocats|Aristocats
2 The Fox and the Hound
2 Cats & Dogs|Cats and Dogs
2 Beverly Hills Chihuahua
2 Happy Feet`),
    angle('robot_movies', 'movies', 'trait', 'Name a movie with a robot in it.', `
1 WALL-E|Wall-E
1 The Terminator|Terminator
1 RoboCop
1 Transformers
1 I, Robot|I Robot
1 Star Wars
1 Big Hero 6
2 The Iron Giant
2 Short Circuit
2 Real Steel
2 Ex Machina
2 Robots
2 Bicentennial Man
2 A.I. Artificial Intelligence|A.I.|AI
2 Chappie
2 Pacific Rim
2 The Wild Robot
2 Blade Runner
2 Metropolis
2 Lost in Space
2 Forbidden Planet
2 Interstellar
2 Bumblebee
2 Avengers: Age of Ultron|Age of Ultron
2 Megan|M3GAN
2 Terminator 2: Judgment Day|Terminator 2|T2
2 Star Wars: A New Hope
2 Batteries Not Included|*batteries not included
2 Robot & Frank
2 The Mitchells vs. the Machines
2 Ron's Gone Wrong
2 Westworld
2 The Stepford Wives
2 Short Circuit 2
Moon
Her
Alita: Battle Angel|Alita
The Creator
Atlas`),
    angle('flippers', 'nature', 'crossover', 'Name something that has flippers.', `
1 Seal
1 Dolphin
1 Penguin
1 Sea turtle|Turtle
1 Scuba diver|Diver
1 Whale
1 Sea lion
1 Pinball machine|Pinball
2 Walrus
2 Manatee
2 Platypus
2 Otter|Sea otter
2 Dugong
2 Snorkeler
2 Orca|Killer whale
2 Swimmer
2 Frogman
Plesiosaur`),
    angle('goodbye_languages', 'words', 'wordplay', 'Name a way to say goodbye in another language.', `
1 Adiós|Adios
1 Au revoir
1 Ciao
1 Sayonara|Sayōnara
1 Aloha
1 Auf Wiedersehen
1 Arrivederci
2 Hasta la vista
2 Hasta luego
2 Bon voyage
2 Tschüss|Tschuss
2 Adieu
2 Shalom
2 Do svidaniya|Dasvidaniya
2 Tchau
2 Salut
2 Namaste
2 Vale
2 Tot ziens
2 Hej då|Hej da
2 Ha det
2 Farvel
2 Zai jian|Zàijiàn
2 Annyeong|Annyeonghi gaseyo
2 Ma'a salama|Ma'a as-salama|Maasalama
2 Kwaheri
2 Slán
2 Cheerio
2 Ta-ta|Ta ta
2 Hasta mañana|Hasta manana
2 À bientôt|A bientot
2 Bis später|Bis spater
2 Addio
2 Até logo|Ate logo
2 Do widzenia
2 Hoşça kal|Hosca kal
2 Näkemiin|Nakemiin
2 Head aega
2 Viszlát|Viszlat
2 Selamat tinggal
2 Paalam
2 Tạm biệt|Tam biet
2 La revedere
2 Ahoj
2 Dovidenia
2 Namárië
2 Khuda hafiz
2 Phir milenge
2 Mata ne
2 Ja mata
2 Jaa ne`),
    angle('itis', 'science', 'wordplay', 'Name a medical condition that ends in "itis."', `
1 Arthritis
1 Tonsillitis
1 Appendicitis
1 Bronchitis
1 Tendinitis|Tendonitis
1 Laryngitis
1 Sinusitis
1 Conjunctivitis|Pink eye
1 Hepatitis
1 Meningitis
2 Gastritis
2 Dermatitis
2 Colitis
2 Pancreatitis
2 Bursitis
2 Gingivitis
2 Otitis|Ear infection
2 Encephalitis
2 Plantar fasciitis|Fasciitis
2 Diverticulitis
2 Pneumonitis
2 Cellulitis
2 Nephritis
2 Mastitis
2 Rhinitis
2 Cystitis
2 Phlebitis
2 Pharyngitis
2 Esophagitis
2 Vasculitis
2 Myocarditis
2 Pericarditis
2 Osteomyelitis
2 Uveitis
2 Neuritis
2 Iritis
2 Keratitis
2 Spondylitis
2 Blepharitis
2 Stomatitis
2 Vaginitis
2 Epididymitis
2 Prostatitis
2 Labyrinthitis
2 Costochondritis
2 Epicondylitis|Tennis elbow
2 Synovitis
2 Gastroenteritis
2 Endocarditis
2 Peritonitis
2 Polio|Poliomyelitis`),
    angle('consoles', 'games', 'category', 'Name a video game console.', `
1 PlayStation|PS1
1 Xbox
1 Nintendo Switch|Switch
1 Wii
1 Nintendo|NES|Nintendo Entertainment System
1 Game Boy|Gameboy
1 Atari|Atari 2600
1 Sega Genesis|Genesis|Mega Drive
1 PlayStation 2|PS2
1 PlayStation 5|PS5
2 PlayStation 3|PS3
2 PlayStation 4|PS4
2 Xbox 360
2 Xbox One
2 Xbox Series X|Series X|Xbox Series S
2 Nintendo 64|N64
2 Super Nintendo|SNES|Super NES
2 GameCube|Nintendo GameCube
2 Wii U
2 Nintendo DS|DS
2 Nintendo 3DS|3DS
2 PSP|PlayStation Portable
2 Dreamcast|Sega Dreamcast
2 Game Boy Advance|GBA
2 Game Boy Color
2 Nintendo Switch 2|Switch 2
2 Steam Deck
2 Sega Saturn|Saturn
2 PS Vita|PlayStation Vita
2 Intellivision
2 ColecoVision
2 Sega Master System|Master System
2 Game Gear|Sega Game Gear
2 Atari Jaguar|Jaguar
2 TurboGrafx-16|TurboGrafx
2 Neo Geo
2 Virtual Boy
2 3DO
2 Magnavox Odyssey|Odyssey
2 Ouya
2 Atari Lynx|Lynx
2 Sega CD
2 Sega 32X|32X
2 N-Gage
2 Meta Quest|Oculus Quest|Quest`),
    angle('table_games', 'games', 'crossover', 'Name a game played on its own kind of table.', `
1 Pool|Billiards
1 Ping-pong|Table tennis|Ping pong
1 Foosball
1 Air hockey
1 Poker
1 Blackjack
2 Roulette
2 Craps
2 Snooker
2 Shuffleboard|Table shuffleboard
2 Beer pong
2 Baccarat
2 Pinball
2 Bumper pool
2 Carrom
2 Sic bo
Mahjong
Bridge
Teqball`),
    angle('construction_gear', 'home', 'everyday', 'Name something a construction worker wears.', `
1 Hard hat|Helmet
1 Boots|Work boots|Steel-toe boots
1 Safety vest|Vest|Reflective vest|Orange vest
1 Gloves|Work gloves
1 Tool belt
1 Safety glasses|Goggles
2 Ear plugs|Earplugs|Ear protection|Earmuffs
2 Overalls
2 Jeans
2 Flannel shirt|Flannel
2 Dust mask|Mask|Respirator
2 Knee pads
2 Harness|Safety harness
2 Jacket|Work jacket
2 T-shirt
2 Sunscreen
2 Bandana`),
    angle('doctor_tools', 'science', 'everyday', 'Name something a doctor uses.', `
1 Stethoscope
1 Thermometer
1 Needle|Syringe|Shot
1 Tongue depressor
1 Gloves
1 Blood pressure cuff|Sphygmomanometer
1 Scalpel
2 Otoscope
2 Reflex hammer|Hammer
2 X-ray|X-ray machine
2 Bandages|Gauze
2 Clipboard|Chart
2 Mask|Face mask
2 Scale
2 Penlight|Flashlight
2 Prescription pad
2 Lab coat|White coat
2 Cotton swab|Swab
2 Forceps
2 Scissors
2 Stitches|Sutures
2 Computer
2 Ultrasound
2 MRI
2 Defibrillator
2 IV|IV drip
2 Pulse oximeter
2 Eye chart
2 Microscope
2 Exam table
Scrubs
Catheter
Speculum
Splint
Cast
Crutches
Wheelchair
Gurney|Stretcher`),
    angle('pirate_gear', 'kids', 'everyday', 'Name something a pirate has.', `
1 Eye patch|Eyepatch
1 Parrot
1 Hook|Hook hand
1 Peg leg|Wooden leg
1 Sword|Cutlass
1 Ship
1 Treasure|Treasure chest|Gold
1 Hat|Pirate hat|Tricorn
1 Treasure map|Map
2 Flag|Jolly Roger|Skull and crossbones
2 Telescope|Spyglass
2 Cannon|Cannons
2 Rum
2 Earring
2 Bandana
2 Boots
2 Beard
2 Crew
2 Plank
2 Pistol|Flintlock
2 Compass
2 Anchor
2 Doubloons|Coins
2 Bottle
2 Rope
2 Sails
2 Crow's nest
2 Wheel|Ship's wheel
2 Shovel
2 Monkey
Dagger
Gold tooth
Bottle of rum
Barrel`),
    angle('hawaii_things', 'geo', 'place', 'Name something Hawaii is known for.', `
1 Beaches|Beach
1 Volcanoes|Volcano
1 Surfing
1 Hula|Hula dancing|Hula dancers
1 Leis|Lei
1 Pineapple|Pineapples
1 Luau|Luaus
1 Aloha
1 Palm trees
2 Ukulele
2 Poke
2 Spam|Spam musubi
2 Shave ice
2 Macadamia nuts
2 Kona coffee|Coffee
2 Pearl Harbor
2 Waikiki
2 Diamond Head
2 Hawaiian shirts|Aloha shirts
2 Rainbows
2 Whales|Humpback whales
2 Sea turtles|Honu
2 Waterfalls
2 Snorkeling
2 Mai tai
2 Coconuts
2 Hibiscus
2 Plate lunch
2 Loco moco
2 Mahi-mahi
2 Sunsets
2 Tiki torches
2 Grass skirts
2 Pipeline|Banzai Pipeline
2 Kilauea
2 Mauna Kea
2 King Kamehameha|Kamehameha
2 Hula girl
2 Lava
2 Ohana`),
    angle('famous_franks', 'people', 'people', 'Name a famous Frank.', `
1 Frank Sinatra
1 Frank Lloyd Wright
1 Anne Frank
2 Frank Zappa
2 Frank Ocean
2 Frank Gifford
2 Frankie Valli
2 Frankie Avalon
2 Frankie Muniz
2 Frank Capra
2 Frank Stallone
2 Frank Gehry
2 Frank Thomas
2 Frank Robinson
2 Frank Langella
2 Frank Oz
2 Frank Abagnale
2 Frank Herbert
2 Frank Baum|L. Frank Baum
2 Frank McCourt
2 Frank Darabont
2 Frank Miller
2 Frank Underwood
2 Frank Costanza
2 Frank Gallagher
2 Frank Reynolds
2 Frank Burns
2 Frank Grillo
2 Frank Caliendo
2 Frank Sinatra Jr.
2 Frankie Knuckles
2 Frankie Lymon
2 Frank Lampard
2 Frank Ribéry|Frank Ribery
2 Frank Rijkaard
2 Frank Shorter
2 Frank Borman
2 Frank Church
2 Frank Wolf
2 Frank Lautenberg
2 Frank Murkowski
2 Frank Purdue|Frank Perdue
2 Frank James`),
    angle('glove_sports', 'sports', 'trait', 'Name a sport where players wear gloves.', `
1 Boxing
1 Baseball
1 Hockey|Ice hockey
1 Golf
1 Softball
2 Football
2 Cricket
2 Lacrosse
2 Field hockey
2 Goalkeeping|Soccer
2 Skiing
2 Cycling
2 Racquetball
2 Kickboxing
2 MMA|Mixed martial arts
2 Weightlifting
2 Rock climbing|Climbing
2 Motocross|Motorcycle racing
2 Auto racing|Racing|NASCAR|Formula One
2 Fencing
2 Equestrian|Horseback riding
2 Handball
2 Rowing
2 Sailing
2 Bobsled
2 Snowboarding`),
    angle('appetizers', 'food', 'category', 'Name an appetizer.', `
1 Chicken wings|Wings|Buffalo wings
1 Mozzarella sticks|Cheese sticks
1 Nachos
1 Spinach dip|Spinach and artichoke dip
1 Shrimp cocktail
1 Bruschetta
1 Chips and salsa|Salsa
1 Egg rolls|Spring rolls
2 Deviled eggs
2 Stuffed mushrooms
2 Potato skins
2 Calamari
2 Onion rings
2 Bloomin' onion|Blooming onion
2 Guacamole
2 Hummus
2 Cheese plate|Charcuterie|Cheese board
2 Pigs in a blanket
2 Meatballs
2 Jalapeño poppers|Poppers
2 Quesadilla
2 Sliders
2 Crab cakes
2 Dumplings|Potstickers
2 Edamame
2 Crab rangoon
2 Caprese
2 Garlic bread
2 Soup
2 Salad
2 Oysters
2 Fried pickles
2 Queso
2 Pretzel bites
2 Mini quiche
2 Antipasto
2 Tapas
2 Samosas
2 Satay
2 Ceviche
2 Arancini
2 Lettuce wraps
2 Cheese fries
2 Toasted ravioli
2 Fried green tomatoes`),
    angle('music_cities', 'music', 'place', 'Name a city famous for its music.', `
1 Nashville
1 New Orleans
1 Memphis
1 Detroit
1 Vienna
1 Liverpool
1 Austin
1 Seattle
1 Los Angeles
1 New York
2 Chicago
2 Atlanta
2 Kansas City
2 London
2 Manchester
2 Havana
2 Rio de Janeiro|Rio
2 Salzburg
2 Paris
2 Berlin
2 Seoul
2 Kingston
2 Bristol
2 Muscle Shoals
2 Clarksdale
2 Branson
2 Minneapolis
2 Philadelphia
2 Athens|Athens, Georgia`),
    angle('baseball_legends', 'sports', 'people', 'Name a legendary baseball player.', `
1 Babe Ruth
1 Jackie Robinson
1 Hank Aaron
1 Mickey Mantle
1 Willie Mays
1 Joe DiMaggio
1 Lou Gehrig
1 Derek Jeter
1 Ted Williams
1 Ty Cobb
2 Roberto Clemente
2 Cal Ripken Jr.|Cal Ripken
2 Nolan Ryan
2 Pete Rose
2 Sandy Koufax
2 Barry Bonds
2 Ken Griffey Jr.|Ken Griffey
2 Stan Musial
2 Yogi Berra
2 Shohei Ohtani|Ohtani
2 Cy Young
2 Honus Wagner
2 Walter Johnson
2 Satchel Paige
2 Josh Gibson
2 Reggie Jackson
2 Rickey Henderson
2 Tony Gwynn
2 Mike Trout
2 Albert Pujols
2 Ichiro Suzuki|Ichiro
2 Mariano Rivera
2 Bob Gibson
2 Johnny Bench
2 Tom Seaver
2 Randy Johnson
2 Greg Maddux
2 Pedro Martínez|Pedro Martinez
2 David Ortiz|Big Papi
2 Alex Rodriguez|A-Rod
2 Mark McGwire
2 Sammy Sosa
2 Roger Clemens
2 Frank Robinson
2 Ernie Banks
2 Rogers Hornsby
2 Christy Mathewson
2 Lefty Grove
2 Jimmie Foxx
2 Mel Ott
2 Warren Spahn
2 Brooks Robinson
2 Carl Yastrzemski
2 George Brett
2 Mike Schmidt
2 Ozzie Smith
2 Wade Boggs
2 Rod Carew
2 Jim Thome
2 Chipper Jones
2 Clayton Kershaw
2 Aaron Judge
2 Fernando Valenzuela
2 Dennis Eckersley
2 Kirby Puckett
2 Joe Morgan
2 Lou Brock`),
    angle('peanut_candy', 'food', 'trait', 'Name a candy with peanuts in it.', `
1 Snickers
1 Reese's Peanut Butter Cups|Reese's|Reese's Cups
1 Peanut M&M's|M&M's|Peanut M&Ms
1 PayDay|Pay Day
1 Baby Ruth
1 Butterfinger
2 Reese's Pieces
2 Mr. Goodbar|Mr Goodbar
2 Nutrageous
2 Goo Goo Cluster
2 Salted Nut Roll
2 Peanut brittle
2 Take 5
2 Planters peanut bar|Peanut bar
2 Snickers Peanut Butter
2 Chick-O-Stick
2 Squirrel Nut Zippers
2 Peanut Chews|Goldenberg's Peanut Chews
2 Cracker Jack
2 Chunky
2 Oh Henry!|Oh Henry
2 Abba-Zaba
2 Clark Bar
2 Butterfinger Bites
2 Twix Peanut Butter
2 Peanut clusters|Chocolate peanut clusters
2 Boston Baked Beans
2 Mary Jane`),
    angle('govt_agencies', 'history', 'wordplay', 'Name a U.S. government agency known by three letters.', `
1 FBI|Federal Bureau of Investigation
1 CIA|Central Intelligence Agency
1 IRS|Internal Revenue Service
1 DEA|Drug Enforcement Administration
1 FDA|Food and Drug Administration
1 EPA|Environmental Protection Agency
1 NSA|National Security Agency
1 DMV|Department of Motor Vehicles
2 FAA|Federal Aviation Administration
2 FCC|Federal Communications Commission
2 SEC|Securities and Exchange Commission
2 TSA|Transportation Security Administration
2 CDC|Centers for Disease Control and Prevention
2 ATF|Bureau of Alcohol, Tobacco, Firearms and Explosives
2 NIH|National Institutes of Health
2 SBA|Small Business Administration
2 SSA|Social Security Administration
2 DHS|Department of Homeland Security
2 DOJ|Department of Justice
2 DOD|Department of Defense
2 DOT|Department of Transportation
2 DOE|Department of Energy
2 FTC|Federal Trade Commission
2 GSA|General Services Administration
2 NPS|National Park Service
2 GAO|Government Accountability Office
2 CBO|Congressional Budget Office
2 OMB|Office of Management and Budget
2 HHS|Department of Health and Human Services
2 HUD|Department of Housing and Urban Development
2 FHA|Federal Housing Administration
2 FEC|Federal Election Commission
2 NRC|Nuclear Regulatory Commission
2 CBP|Customs and Border Protection
2 ICE|Immigration and Customs Enforcement
2 FED|Fed|Federal Reserve
2 NEA|National Endowment for the Arts
2 NSF|National Science Foundation
2 OPM|Office of Personnel Management
2 DIA|Defense Intelligence Agency
2 TVA|Tennessee Valley Authority`),
    angle('kitchen_things', 'home', 'place', 'Name something you\'d find in a kitchen.', `
1 Refrigerator|Fridge
1 Stove|Oven|Range
1 Microwave
1 Sink
1 Dishwasher
1 Toaster
1 Pots|Pot|Pans|Pan|Pots and pans
1 Plates|Dishes|Plate
1 Silverware|Forks|Knives|Spoons|Cutlery|Utensils
1 Cups|Mugs|Glasses
1 Coffee maker|Coffee pot|Keurig
1 Table|Kitchen table
2 Cabinets|Cupboards|Cabinet
2 Counter|Countertop
2 Blender
2 Spatula
2 Cutting board
2 Bowls|Bowl
2 Kettle|Teakettle
2 Trash can|Garbage can|Trash
2 Paper towels
2 Dish soap|Soap
2 Sponge
2 Dish towel|Towel
2 Oven mitts|Pot holders
2 Mixer|Stand mixer
2 Can opener
2 Whisk
2 Ladle
2 Colander|Strainer
2 Measuring cups
2 Rolling pin
2 Food processor
2 Air fryer
2 Toaster oven
2 Spice rack|Spices
2 Salt and pepper
2 Pantry
2 Drawers|Junk drawer
2 Chairs|Stools
2 Apron
2 Cookbook|Cookbooks
2 Timer
2 Tongs
2 Grater
2 Peeler
2 Knife block
2 Fruit bowl
2 Crock-Pot|Slow cooker
2 Instant Pot
2 Rice cooker
2 Baking sheet|Cookie sheet
2 Aluminum foil|Foil
2 Plastic wrap
2 Tupperware|Containers
2 Island|Kitchen island
2 Faucet
2 Garbage disposal
2 Freezer
2 Magnets
2 Calendar
2 Clock
Hood|Range hood
Dish rack|Drying rack`),
    angle('bathroom_things', 'home', 'place', 'Name something you\'d find in a bathroom.', `
1 Toilet
1 Sink
1 Shower
1 Bathtub|Tub
1 Toilet paper
1 Towels|Towel
1 Toothbrush
1 Toothpaste
1 Soap
1 Mirror
1 Shampoo
2 Conditioner
2 Hair dryer|Blow dryer
2 Razor
2 Shaving cream
2 Floss|Dental floss
2 Mouthwash
2 Deodorant
2 Lotion
2 Bath mat|Rug
2 Shower curtain
2 Plunger
2 Toilet brush
2 Scale
2 Medicine cabinet
2 Trash can|Wastebasket
2 Hand towel
2 Washcloth
2 Loofah
2 Body wash
2 Cotton balls
2 Q-tips|Cotton swabs
2 Makeup
2 Hairbrush|Brush|Comb
2 Tissues|Kleenex
2 Air freshener
2 Nail clippers
2 Tweezers
2 Bath bombs
2 Rubber duck|Rubber ducky
2 Curling iron
2 Straightener|Flat iron
2 Toilet seat
2 Faucet
2 Fan|Exhaust fan
2 Night light
2 Candle
2 Magazine|Magazines
2 Medicine|Pills|Aspirin
2 Band-Aids|Bandages
2 Sunscreen
2 Perfume|Cologne
2 Bidet
2 Hamper
2 Hand soap
Shower cap
Bubble bath
Epsom salt`),
    angle('garage_things', 'home', 'place', 'Name something you\'d find in a garage.', `
1 Car
1 Tools|Toolbox
1 Lawn mower|Lawnmower|Mower
1 Bicycle|Bike|Bikes
1 Boxes
1 Garbage can|Trash can|Recycling bin
2 Ladder
2 Workbench
2 Shelves
2 Rake
2 Shovel|Snow shovel
2 Hose|Garden hose
2 Paint|Paint cans
2 Freezer|Extra fridge|Refrigerator
2 Garage door opener
2 Motor oil|Oil
2 Spare tire|Tires
2 Christmas decorations|Holiday decorations|Decorations
2 Sports equipment|Balls
2 Camping gear|Tent
2 Cooler
2 Grill
2 Leaf blower
2 Snowblower
2 Weed eater|Weed whacker|String trimmer
2 Wheelbarrow
2 Power tools|Drill|Saw
2 Hammer
2 Screwdriver
2 Wrench
2 Extension cord
2 Broom
2 Wagon
2 Car jack|Jack
2 Jumper cables
2 Antifreeze
2 Fertilizer
2 Pegboard
2 Junk
2 Spiders|Spider webs|Cobwebs
2 Mouse|Mice
2 Washer|Dryer|Washer and dryer
2 Water heater
2 Kayak|Canoe
2 Golf clubs
2 Skateboard
2 Scooter
2 Motorcycle
2 Sled
2 Fishing poles|Fishing rods`),
    angle('desk_things', 'home', 'place', 'Name something you\'d find on an office desk.', `
1 Computer|Laptop
1 Phone|Telephone
1 Pens|Pen
1 Pencils|Pencil
1 Stapler
1 Paper|Papers|Paperwork
1 Keyboard
1 Mouse
1 Monitor|Screen
2 Calendar
2 Sticky notes|Post-it notes|Post-its
2 Notepad|Notebook
2 Tape|Tape dispenser
2 Scissors
2 Paper clips
2 Coffee mug|Mug|Coffee
2 Lamp|Desk lamp
2 Photos|Pictures|Picture frame
2 Plant
2 Calculator
2 Highlighter|Highlighters
2 Rubber bands
2 Mouse pad
2 Pencil holder|Pen cup
2 Eraser
2 Ruler
2 Business cards
2 Folders|File folders
2 Inbox|In-tray
2 Water bottle
2 Snacks
2 Hand sanitizer
2 Tissues
2 Name plate|Nameplate
2 Headphones
2 Charger
2 Clock
2 Envelopes
2 Binder
2 Hole punch
2 Staple remover
2 Paperweight
2 Desk organizer
2 Clipboard
2 Thumbtacks
2 Correction fluid|White-out|Wite-Out
2 Stamp
2 Planner
2 Printer`),
    angle('movie_theater', 'movies', 'place', 'Name something you\'d see at a movie theater.', `
1 Popcorn
1 Screen
1 Seats|Seat
1 Candy
1 Soda|Drinks
1 Tickets|Ticket
1 Previews|Trailers
1 Movie posters|Posters
2 Nachos
2 Hot dogs
2 Concession stand|Snack bar
2 Projector
2 Ushers|Usher
2 Box office|Ticket booth
2 Arcade games|Arcade
2 Cupholders|Cup holder
2 Exit signs
2 3D glasses
2 Recliners
2 Butter|Popcorn butter
2 Sticky floor
2 Kids|Families|People
2 Couples|Dates
2 Ticket stubs
2 Cardboard cutouts|Standees
2 Restrooms|Bathroom
2 Lobby
2 Curtains
2 Speakers
2 Credits
2 Cell phones|Phones
2 Icee|Slushie
2 Junior Mints
2 Milk Duds
2 Twizzlers
2 Sour Patch Kids
2 Raisinets
2 Pretzels
2 Ice cream
2 Water`),
    angle('newspaper_sections', 'words', 'everyday', 'Name a section of a newspaper.', `
1 Sports
1 Comics|Funnies|Comic strips
1 Weather
1 Obituaries|Obits
1 Classifieds|Classified ads|Want ads
1 Front page|Headlines
2 Business|Finance
2 Opinion|Op-ed|Editorials|Editorial
2 Entertainment|Arts
2 Crossword|Puzzles|Sudoku
2 Horoscopes|Horoscope
2 Advice column|Dear Abby
2 Letters to the editor|Letters
2 Local news|Metro|Local
2 World news|International
2 National news|National
2 Politics
2 Lifestyle|Style
2 Food
2 Travel
2 Real estate
2 Coupons|Ads
2 TV listings|TV guide
2 Movie listings|Movies
2 Book reviews|Books
2 Science
2 Health
2 Technology|Tech
2 Society pages|Weddings|Wedding announcements
2 Stock market|Stocks
2 Gossip
2 Fashion
2 Home and garden|Home
2 Autos|Cars
2 Education
2 Religion
2 Sunday magazine|Magazine
2 Police blotter|Crime`),
    angle('car_brands', 'tech', 'category', 'Name a car brand.', `
1 Ford
1 Toyota
1 Honda
1 Chevrolet|Chevy
1 BMW
1 Mercedes-Benz|Mercedes
1 Tesla
1 Nissan
1 Jeep
1 Volkswagen|VW
1 Ferrari
1 Porsche
1 Audi
1 Hyundai
1 Kia
1 Subaru
1 Mazda
1 Dodge
1 Cadillac
1 Lexus
2 Lamborghini
2 Rolls-Royce|Rolls Royce
2 Bentley
2 Jaguar
2 Land Rover|Range Rover
2 Volvo
2 Buick
2 GMC
2 Chrysler
2 Ram
2 Lincoln
2 Acura
2 Infiniti
2 Mitsubishi
2 Fiat
2 Alfa Romeo
2 Maserati
2 Aston Martin
2 McLaren
2 Bugatti
2 Mini
2 Genesis
2 Rivian
2 Lucid
2 Polestar
2 Peugeot
2 Renault
2 Citroën|Citroen
2 Skoda|Škoda
2 Seat
2 Suzuki
2 Saab
2 Pontiac
2 Oldsmobile
2 Plymouth
2 Saturn
2 Mercury
2 Hummer
2 DeLorean
2 Studebaker
2 AMC
2 Lotus
2 Opel
2 Dacia
2 BYD
2 Geely
2 Tata
2 Mahindra
2 Daewoo
2 Isuzu
2 Smart
2 Scion
2 Datsun
2 Pagani
2 Koenigsegg
2 Lancia
2 Vauxhall
2 Holden
2 Proton
2 Lada`),
    angle('superheroes', 'movies', 'people', 'Name a superhero.', `
1 Superman
1 Batman
1 Spider-Man|Spiderman
1 Wonder Woman
1 Iron Man
1 Captain America
1 The Hulk|Hulk
1 Thor
1 Black Panther
1 Wolverine
1 The Flash|Flash
1 Aquaman
2 Black Widow
2 Captain Marvel
2 Green Lantern
2 Hawkeye
2 Doctor Strange
2 Ant-Man
2 Deadpool
2 Storm
2 Cyclops
2 Jean Grey|Phoenix
2 Rogue
2 Gambit
2 Professor X
2 Daredevil
2 Robin
2 Batgirl
2 Supergirl
2 Catwoman
2 Green Arrow
2 Cyborg
2 Shazam
2 Martian Manhunter
2 The Thing|Thing
2 Human Torch
2 Mister Fantastic|Mr. Fantastic
2 Invisible Woman
2 Silver Surfer
2 Scarlet Witch
2 Vision
2 Falcon
2 Winter Soldier
2 Star-Lord
2 Groot
2 Rocket|Rocket Raccoon
2 Gamora
2 Drax
2 Nightcrawler
2 Beast
2 Iceman
2 Colossus
2 Kitty Pryde|Shadowcat
2 Ms. Marvel
2 She-Hulk
2 Luke Cage
2 Jessica Jones
2 Iron Fist
2 Punisher
2 Blade
2 Moon Knight
2 Shang-Chi
2 Nova
2 Hellboy
2 Spawn
2 The Incredibles|Mr. Incredible|Elastigirl
2 Static|Static Shock
2 Blue Beetle
2 Hawkgirl
2 Zatanna
2 Nightwing
2 Squirrel Girl
2 Miles Morales
2 Spider-Gwen|Ghost-Spider
2 Wasp
2 War Machine
2 Captain Planet
2 Underdog
2 Mighty Mouse
2 The Tick
2 Invincible
2 Homelander`),
    angle('ghibli', 'movies', 'category', 'Name a Studio Ghibli movie.', `
1 Spirited Away
1 My Neighbor Totoro|Totoro
1 Howl's Moving Castle
1 Princess Mononoke
1 Kiki's Delivery Service
1 Ponyo
2 Castle in the Sky|Laputa
2 Grave of the Fireflies
2 The Wind Rises
2 The Boy and the Heron
2 Nausicaä of the Valley of the Wind|Nausicaa
2 Porco Rosso
2 Whisper of the Heart
2 Arrietty|The Secret World of Arrietty
2 The Cat Returns
2 Only Yesterday
2 Pom Poko
2 From Up on Poppy Hill
2 The Tale of the Princess Kaguya|Princess Kaguya
2 When Marnie Was There
2 Tales from Earthsea
2 My Neighbors the Yamadas
2 Ocean Waves
2 Earwig and the Witch`),
    angle('apple_products', 'tech', 'category', 'Name an Apple product.', `
1 iPhone
1 iPad
1 MacBook|MacBook Pro|MacBook Air
1 AirPods
1 Apple Watch
1 iMac
1 iPod
2 Mac
2 Mac mini
2 Mac Pro
2 Mac Studio
2 Apple TV
2 HomePod
2 Vision Pro|Apple Vision Pro
2 AirTag
2 Apple Pencil
2 Magic Mouse
2 Magic Keyboard
2 iPod nano
2 iPod shuffle
2 iPod touch
2 iPad Pro
2 iPad mini
2 iPad Air
2 AirPods Pro
2 AirPods Max
2 Apple II
2 Macintosh
2 Newton
2 Lisa
2 eMac
2 iBook
2 PowerBook
2 Power Mac
2 Pro Display XDR
2 Studio Display
2 Apple Card
2 iTunes
2 Siri
2 FaceTime`),
    angle('shapes', 'science', 'category', 'Name a shape.', `
1 Circle
1 Square
1 Triangle
1 Rectangle
1 Oval
1 Star
1 Heart
1 Diamond
2 Pentagon
2 Hexagon
2 Octagon
2 Trapezoid
2 Parallelogram
2 Rhombus
2 Cube
2 Sphere
2 Cylinder
2 Cone
2 Pyramid
2 Crescent
2 Ellipse
2 Arrow
2 Cross
2 Spiral
2 Heptagon
2 Nonagon
2 Decagon
2 Dodecagon
2 Polygon
2 Kite
2 Prism
2 Torus|Donut
2 Semicircle
2 Quadrilateral
2 Octahedron
2 Tetrahedron
2 Dodecahedron
2 Icosahedron
2 Hexagonal prism
2 Teardrop
2 Trefoil
2 Arch`),
    angle('norse_gods', 'history', 'category', 'Name a Norse god.', `
1 Thor
1 Odin
1 Loki
2 Freya|Freyja
2 Frigg|Frigga
2 Baldur|Balder
2 Heimdall
2 Tyr|Týr
2 Hel
2 Freyr|Frey
2 Njord|Njörd
2 Bragi
2 Idun|Iðunn|Idunn
2 Sif
2 Vidar|Víðarr
2 Vali
2 Hodr|Hod|Höðr
2 Ullr|Ull
2 Forseti
2 Skadi|Skaði
2 Mimir
2 Aegir|Ægir
2 Ran|Rán
2 Hermod
2 Sol|Sól
2 Mani|Máni`),
    angle('computer_brands', 'tech', 'category', 'Name a computer brand.', `
1 Apple|Mac
1 Dell
1 HP|Hewlett-Packard
1 Lenovo
1 Microsoft|Surface
1 Acer
1 Asus
1 IBM
2 Samsung
2 Toshiba
2 Sony|Vaio
2 Compaq
2 Gateway
2 Alienware
2 Razer
2 MSI
2 LG
2 Google|Chromebook|Pixelbook
2 Huawei
2 Xiaomi
2 Framework
2 Fujitsu
2 Panasonic|Toughbook
2 Commodore
2 Atari
2 Packard Bell
2 eMachines
2 Sun Microsystems|Sun
2 Silicon Graphics|SGI
2 NeXT
2 Tandy|Radio Shack
2 Texas Instruments|TI
2 Kaypro
2 Osborne
2 Amiga
2 Sinclair
2 Acorn
2 Wang
2 Digital Equipment Corporation|DEC
2 Cray
2 System76
2 Origin PC
2 CyberPowerPC
2 Medion
2 Clevo`),
  ];


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
  for (const a of ANGLES) UNIVERSES['a_' + a.id] = { id: 'a_' + a.id, items: a.items, short: a.text };


  const R = typeof Rarity !== 'undefined' ? Rarity : require('./rarity.js');
  for (const u of Object.values(UNIVERSES)) for (const it of u.items) it.fam = (R[u.id] || {})[it.name];

  return { UNIVERSES, ANGLES, COMMODITY, LANDLOCKED, MX_PACIFIC, CONTINENT, REGION, STATE_LISTS, ELEMENT_LISTS, PARTY, PRES_LISTS, TEAM_PLACES, ZODIAC, NEW_TESTAMENT, BEST_PICTURE_RECENT };
})();
if (typeof module !== 'undefined') module.exports = Data;
