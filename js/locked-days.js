/* Paco's Island: daily sets already played, locked by tools/lock-days.mjs.
   Do not edit by hand. Day 1 is the first entry. Later days are built from the
   question pool, carrying on from the last locked day. */
'use strict';
const LockedDays = {
  paco: [
    ["a_painters.all","states.midwest","a_coffee_drinks.all","a_thanksgiving.all","nfl.starts-b","a_nobel_categories.all","a_famous_taylor.all"],
    ["bible.all","a_childhood_toys.all","a_old_west_outlaws.all","a_dating_apps.all","a_pasta_sauce.all","a_hospital_tv.all","elements.starts-t"],
    ["a_goodbye_languages.all","a_paintings.all","a_rihanna_hits.all","a_disney_broadway.all","a_striped_animals.all","countries.opec","monopoly.avenue"],
    ["a_net_sports.all","a_potter_characters.all","a_comic_strip_animals.all","a_december_holidays.all","a_roman_planets.all","a_nyc_boroughs.all","a_famous_jennifer.all"],
    ["a_oscar_hosts.all","a_fabrics.all","a_composers.all","a_hibernators.all","elements.precious","henry.all","capitals.starts-n"],
  ],
  mario: [
    ["states.south","a_christmas_songs.all","a_ballets.all","a_card_games.all","a_simpsons_chars.all","a_roman_planets.all","a_paris_movies.all"],
    ["birthstones.all","a_computer_brands.all","a_after_birthday.all","a_old_west_outlaws.all","a_pizza_toppings.all","a_pooh_friends.all","bible.ot"],
    ["a_famous_matts.all","a_scientists.all","a_adult_cartoons.all","a_table_games.all","a_mouth_instruments.all","a_racket_sports.all","a_terriers.all"],
    ["a_govt_agencies.all","a_horse_movies.all","a_thanksgiving.all","a_coffee_drinks.all","a_hawaii_islands.all","a_disney_broadway.all","a_saturday_cartoons.all"],
    ["a_netflix_shows.all","a_first_aid.all","a_french_desserts.all","a_vitamins.all","a_austen_characters.all","a_big_cats.all","a_nobel_categories.all"],
  ],
  vacation: [
    ["a_paintings.all","a_designers.all","a_famous_kates.all","teams.canada","a_ny_movies.all","rainbow.all","a_desert_animals.all"],
    ["a_car_brands.all","a_kitchen_things.all","a_office_chars.all","countries.tea","a_potter_characters.all","a_wedding_things.all","grease.all"],
    ["destinys.all","a_painters.all","a_streep_movies.all","a_horned_animals.all","a_animated_oscar.all","birthstones.all","reindeer.all"],
    ["a_govt_agencies.all","bible.all","nato.all","a_wall_plugs.all","a_famous_dans.all","a_organs.all","a_pirate_gear.all"],
    ["planets.all","starbucks.all","a_peanut_candy.all","a_apple_products.all","a_sitcoms_00s.all","a_blue_shades.all","a_national_parks.all"],
  ],
};
if (typeof module !== 'undefined') module.exports = LockedDays;
