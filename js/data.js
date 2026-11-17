/* Paco's Island: answer universes.

   Every question is a cut of one closed list below. Each line is one item:
     Display name|other accepted spelling|=another real name for it
   A plain alias is accepted when typed. An alias starting with "=" is a real
   name for the item (Ivory Coast, Czech Republic), so it also counts when a
   question asks about letters in the name.

   tier is a day one guess at how often players think of an item, from
   1 (almost everyone) to 5 (almost no one). Real answer counts replace it
   once enough people have played a question. */
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
  };

  return { UNIVERSES, LANDLOCKED, MX_PACIFIC };
})();
if (typeof module !== 'undefined') module.exports = Data;
