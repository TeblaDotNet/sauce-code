# Knowledge images — batch 2

100 existing ingredient pages now have reviewed, locally hosted photographs. Coverage rises from 49 to **149 of 911 enriched pages**, leaving **762** without images. No recipe, canonical identity, relationship, resource or knowledge prose was changed.

The new assets total **11,293,827 bytes (10.8 MiB)**. Each is an optimised progressive JPEG, quality 82, at most 960 pixels on its longest edge and below 350 KB. Full frames are retained without upscaling. Sources are Wikimedia Commons file records with public-domain, CC0, CC BY or CC BY-SA licensing; exact versions and ports are preserved. Creator credit, original source, licence link, caption, dimensions, derivative notice and checksum are recorded for every image in [the ledger](knowledge-images-batch-2.json) and [asset attribution](../assets/references/ATTRIBUTION.md).

## Selection and limitations

All 100 selected frames were inspected. Misleading search results were rejected, including decorative milk glass, a band logo for cream, an unsuitable bean variety, a different herb returned for oregano, a black-and-white art photograph for green bell pepper, and noodles merely served with egg. The chosen egg-noodle photograph is a prepared dish, labelled accordingly. Botanical herb photographs show flowering plants where appropriate; captions do not claim to show detached culinary leaves. The salmon photograph shows drying sockeye fillets; the mushroom assortment is explicitly not an identification guide. Photographs illustrate the captioned subject, not every variety or preparation represented by an identity.

No licence is inferred from a search-result title. File-specific Commons metadata is retained in the ledger. Public-domain records without a separate licence URL link to their source licensing section. Existing uncertain historical creator attribution is retained rather than invented. Embedded image metadata is removed, while credit remains visible on the page and in the ledger.

## Validation

- Core: type checking, build, 1,288 tests, documentation links and quality audit passed. The existing 10 sample quality findings remain unchanged.
- Corpus: 395 tests and 490 recipe parses passed; no Corpus source changes.
- Site: type checking, 128 tests, build and validation passed: 1,667 pages, 1,973 files, 66,611 internal links and 2,450 fragments.
- Regression tests pin all 100 image checksums and metadata, preserve the complete previous enrichment registry after removing only these new hero fields, and verify all canonical files, resources and previous image files remain unchanged. Historical batch expectations retain their original snapshots.
- Clean-source export audit passed: 1,389 files, 969 knowledge entries and 14 samples; unrelated user files and ignored archives excluded.
- Ordinary localhost HTTP audit passed: all 1,667 HTML pages matched built bytes; all 100 new image URLs returned 200, image/jpeg and exact SHA-256 content, with captions and credits verified. Transient connection resets required bounded transport-only retries; no status/content assertion was relaxed.
- Documentation checks (30 documents) and Git whitespace checks passed. Core and Site changes are locally committed on codex/knowledge-images-batch-2; no merge, push or deployment.
- Visual review: contact sheets of all selections, plus an ordinary in-app browser spot-check of coconut showing its image, caption and expanded licence/credit. This is not a full browser suite or mobile/theme matrix.

## Pages

| Page | Licence | Dimensions | Bytes | Source |
| --- | --- | --- | --- | --- |
| allspice | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 718 | 124,943 | [Source](https://commons.wikimedia.org/wiki/File:Allspice_Berries_(2426054523).jpg) |
| almonds | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 96,820 | [Source](https://commons.wikimedia.org/wiki/File:Almonds_-_in_shell,_shell_cracked_open,_shelled,_blanched.jpg) |
| artichoke | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 707 × 960 | 106,566 | [Source](https://commons.wikimedia.org/wiki/File:Artichoke_J1.jpg) |
| arugula | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 960 × 641 | 171,625 | [Source](https://commons.wikimedia.org/wiki/File:Arugula_(51107429934).jpg) |
| bacon | [Public domain](https://commons.wikimedia.org/wiki/File:Made20bacon.png#Licensing) | 698 × 382 | 30,527 | [Source](https://commons.wikimedia.org/wiki/File:Made20bacon.png) |
| baguette | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 180,993 | [Source](https://commons.wikimedia.org/wiki/File:Baguettes,_Paris,_France_-_panoramio.jpg) |
| bay-leaf | [Public domain](https://commons.wikimedia.org/wiki/File:Bay_Leaves.JPG#Licensing) | 960 × 720 | 100,108 | [Source](https://commons.wikimedia.org/wiki/File:Bay_Leaves.JPG) |
| black-pepper | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 720 × 960 | 94,734 | [Source](https://commons.wikimedia.org/wiki/File:Black_peppercorns_gn.jpg) |
| black-tea | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 894 | 50,349 | [Source](https://commons.wikimedia.org/wiki/File:Cup_of_black_tea.JPG) |
| blueberries | [Public domain](https://commons.wikimedia.org/wiki/File:Blueberries.jpg#Licensing) | 640 × 418 | 31,002 | [Source](https://commons.wikimedia.org/wiki/File:Blueberries.jpg) |
| bread-crumbs | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 720 | 125,849 | [Source](https://commons.wikimedia.org/wiki/File:Breadcrumb.jpg) |
| buckwheat | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 617 | 183,939 | [Source](https://commons.wikimedia.org/wiki/File:Buckwheat_and_products_from_it_01.jpg) |
| butternut-squash | [Public domain](https://commons.wikimedia.org/wiki/File:Cucurbita_moschata_Butternut_2012_G2.jpg#Licensing) | 960 × 640 | 221,828 | [Source](https://commons.wikimedia.org/wiki/File:Cucurbita_moschata_Butternut_2012_G2.jpg) |
| cannellini-beans | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 640 | 76,502 | [Source](https://commons.wikimedia.org/wiki/File:Cannellini_beans.jpg) |
| caraway | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 800 × 600 | 54,365 | [Source](https://commons.wikimedia.org/wiki/File:Caraway_Seed.jpg) |
| cardamom | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 641 | 121,900 | [Source](https://commons.wikimedia.org/wiki/File:02017_0119_Kardamom,_Winter_in_den_Beskiden.jpg) |
| celeriac | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 108,780 | [Source](https://commons.wikimedia.org/wiki/File:C%C3%A9leri-rave-fendu.jpg) |
| celery-seed | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 720 | 130,026 | [Source](https://commons.wikimedia.org/wiki/File:Celery_seed.jpg) |
| champignon-mushroom | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 800 × 570 | 60,216 | [Source](https://commons.wikimedia.org/wiki/File:ChampignonMushroom.jpg) |
| chives | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 540 | 219,189 | [Source](https://commons.wikimedia.org/wiki/File:Chives_(5822048347).jpg) |
| chocolate | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 66,584 | [Source](https://commons.wikimedia.org/wiki/File:Three_Bars_(1).jpg) |
| chocolate-chips | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 960 × 651 | 111,024 | [Source](https://commons.wikimedia.org/wiki/File:Semi-sweet_chocolate_chips.jpg) |
| chorizo | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 531 × 387 | 63,710 | [Source](https://commons.wikimedia.org/wiki/File:Chorizos_P6021974.jpg) |
| cinnamon | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 550 | 86,457 | [Source](https://commons.wikimedia.org/wiki/File:Cinnamomum_verum_spices.jpg) |
| clams | [Public domain](https://commons.wikimedia.org/wiki/File:LittleNeck_clams_USDA96c1862.jpg#Licensing) | 640 × 432 | 50,372 | [Source](https://commons.wikimedia.org/wiki/File:LittleNeck_clams_USDA96c1862.jpg) |
| clementine | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 720 | 156,582 | [Source](https://commons.wikimedia.org/wiki/File:Clementines_whole,_peeled,_half_and_sectioned.jpg) |
| cloves | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 78,591 | [Source](https://commons.wikimedia.org/wiki/File:Clove_close_up.jpg) |
| cocoa-powder | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 720 × 960 | 90,854 | [Source](https://commons.wikimedia.org/wiki/File:Cocoa_powder.jpg) |
| coconut | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 95,875 | [Source](https://commons.wikimedia.org/wiki/File:Coconuts_-_single_and_cracked_open.jpg) |
| coffee | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 600 | 164,214 | [Source](https://commons.wikimedia.org/wiki/File:Latte_and_dark_coffee.jpg) |
| coffee-beans | [Public domain](https://commons.wikimedia.org/wiki/File:Roasted_coffee_beans.jpg#Licensing) | 960 × 720 | 172,212 | [Source](https://commons.wikimedia.org/wiki/File:Roasted_coffee_beans.jpg) |
| corn-flakes | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 873 | 160,325 | [Source](https://commons.wikimedia.org/wiki/File:Kellogg%27s_Corn_Flakes,_with_milk.jpg) |
| cream | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 643 × 960 | 34,622 | [Source](https://commons.wikimedia.org/wiki/File:Cream_Drop.jpg) |
| cumin | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 540 | 47,993 | [Source](https://commons.wikimedia.org/wiki/File:Cumin_seed.jpg) |
| dill | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | 960 × 540 | 188,348 | [Source](https://commons.wikimedia.org/wiki/File:Dill_herbs.jpg) |
| egg-noodles | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 153,030 | [Source](https://commons.wikimedia.org/wiki/File:Egg_noodles-MB28.jpg) |
| fennel-seeds | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 443 × 700 | 79,668 | [Source](https://commons.wikimedia.org/wiki/File:Fennel_seeds.jpg) |
| feta | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 960 × 768 | 92,962 | [Source](https://commons.wikimedia.org/wiki/File:Feta_Cheese.jpg) |
| garam-masala | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | 960 × 717 | 165,756 | [Source](https://commons.wikimedia.org/wiki/File:Garammasalaphoto.jpg) |
| green-bell-pepper | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 746 | 73,556 | [Source](https://commons.wikimedia.org/wiki/File:Capsicum_annuum_fruits_IMGP0049.jpg) |
| green-tea | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 819 × 614 | 46,657 | [Source](https://commons.wikimedia.org/wiki/File:Green_tea_3_appearances.jpg) |
| guanciale | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 491 | 52,385 | [Source](https://commons.wikimedia.org/wiki/File:Guanciale_closeup_(cropped).jpg) |
| ham | [Public domain](https://commons.wikimedia.org/wiki/File:Ham_(4).jpg#Licensing) | 960 × 640 | 90,485 | [Source](https://commons.wikimedia.org/wiki/File:Ham_(4).jpg) |
| honey | [Public domain](https://commons.wikimedia.org/wiki/File:Runny_hunny.jpg#Licensing) | 633 × 960 | 116,511 | [Source](https://commons.wikimedia.org/wiki/File:Runny_hunny.jpg) |
| jalapeno | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 717 | 136,611 | [Source](https://commons.wikimedia.org/wiki/File:Jalape%C3%B1o_Peppers_-_levels_of_ripening.JPG) |
| kidney-beans | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 640 | 107,075 | [Source](https://commons.wikimedia.org/wiki/File:Red_kidney_beans_2024-11-27.jpg) |
| lentils | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 960 × 550 | 104,667 | [Source](https://commons.wikimedia.org/wiki/File:3_types_of_lentil.png) |
| macadamia-nut | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 720 × 960 | 97,675 | [Source](https://commons.wikimedia.org/wiki/File:Macadamia_nuts.jpg) |
| macaroni | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 629 | 17,997 | [Source](https://commons.wikimedia.org/wiki/File:Macaroni2.jpg) |
| maple-syrup | [Public domain](https://commons.wikimedia.org/wiki/File:Maple_syrup.jpg#Licensing) | 483 × 960 | 55,074 | [Source](https://commons.wikimedia.org/wiki/File:Maple_syrup.jpg) |
| marjoram | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 721 × 960 | 122,106 | [Source](https://commons.wikimedia.org/wiki/File:Origanum_majorana_002.JPG) |
| mascarpone | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 639 | 157,758 | [Source](https://commons.wikimedia.org/wiki/File:Mascarpone_4.png) |
| matcha-powder | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 926 | 187,852 | [Source](https://commons.wikimedia.org/wiki/File:Matcha_Scoop.jpg) |
| milk | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 958 × 960 | 101,558 | [Source](https://commons.wikimedia.org/wiki/File:Glass_of_Milk_(33657535532).jpg) |
| mint | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | 960 × 720 | 126,042 | [Source](https://commons.wikimedia.org/wiki/File:Mint-leaves-2007.jpg) |
| miso | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 640 | 61,375 | [Source](https://commons.wikimedia.org/wiki/File:Miso_001.jpg) |
| mushrooms | [Public domain](https://commons.wikimedia.org/wiki/File:Edible_fungi_in_basket_2009_G1_(cropped).jpg#Licensing) | 960 × 507 | 150,757 | [Source](https://commons.wikimedia.org/wiki/File:Edible_fungi_in_basket_2009_G1_(cropped).jpg) |
| nori | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 761 | 151,644 | [Source](https://commons.wikimedia.org/wiki/File:Nori.jpg) |
| nutmeg | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 158,309 | [Source](https://commons.wikimedia.org/wiki/File:Biji_Pala_Bubuk.jpg) |
| oats | [Public domain](https://commons.wikimedia.org/wiki/File:Rolled_oats.jpg#Licensing) | 695 × 451 | 52,259 | [Source](https://commons.wikimedia.org/wiki/File:Rolled_oats.jpg) |
| oregano | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 640 × 960 | 64,672 | [Source](https://commons.wikimedia.org/wiki/File:Origanum_vulgare_-_harilik_pune.jpg) |
| pancetta | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 698 | 112,460 | [Source](https://commons.wikimedia.org/wiki/File:Pancetta.jpg) |
| paneer | [CC BY 2.0 de](https://creativecommons.org/licenses/by/2.0/de/deed.en) | 960 × 720 | 216,680 | [Source](https://commons.wikimedia.org/wiki/File:Panir_Paneer_Indian_cheese_fresh.jpg) |
| paprika | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 320 × 180 | 9,305 | [Source](https://commons.wikimedia.org/wiki/File:Piment%C3%B3n_Tap_de_Cort%C3%AD_(cropped).jpg) |
| parmesan-cheese | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 934 × 960 | 158,117 | [Source](https://commons.wikimedia.org/wiki/File:Parmigiano_Reggiano,_Italien,_Europ%C3%A4ische_Union.jpg) |
| pasta | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 202,605 | [Source](https://commons.wikimedia.org/wiki/File:(Pasta)_by_David_Adam_Kess_(pic.2).jpg) |
| peanut | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 76,331 | [Source](https://commons.wikimedia.org/wiki/File:Peanuts_(Arachis_hypogaea)_-_in_shell,_shell_cracked_open,_shelled,_peeled.jpg) |
| peanut-butter | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 98,251 | [Source](https://commons.wikimedia.org/wiki/File:2020-03-24_20_57_22_An_open_jar_of_Skippy_Creamy_Peanut_Butter_in_the_Dulles_section_of_Sterling,_Loudoun_County,_Virginia.jpg) |
| pecan | [Public domain](https://commons.wikimedia.org/wiki/File:Pecans.jpg#Licensing) | 960 × 628 | 222,529 | [Source](https://commons.wikimedia.org/wiki/File:Pecans.jpg) |
| pecorino-romano | [Public domain](https://commons.wikimedia.org/wiki/File:Pecorino_romano_cheese.jpg#Licensing) | 960 × 720 | 111,072 | [Source](https://commons.wikimedia.org/wiki/File:Pecorino_romano_cheese.jpg) |
| poppy-seeds | [Public domain](https://commons.wikimedia.org/wiki/File:Poppy_seeds.jpg#Licensing) | 960 × 719 | 251,097 | [Source](https://commons.wikimedia.org/wiki/File:Poppy_seeds.jpg) |
| pork-belly | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 639 | 99,199 | [Source](https://commons.wikimedia.org/wiki/File:Schweinebauch-2.jpg) |
| raisins | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 603 | 151,165 | [Source](https://commons.wikimedia.org/wiki/File:Raisins_01.jpg) |
| red-chilli | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 960 | 316,242 | [Source](https://commons.wikimedia.org/wiki/File:Capsicum_annuum-Red_Chilli_Pepper_01.jpg) |
| rice | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 720 × 960 | 150,279 | [Source](https://commons.wikimedia.org/wiki/File:Long_grain_rice.jpg) |
| rice-noodles | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 540 | 160,153 | [Source](https://commons.wikimedia.org/wiki/File:Rice_vermicelli.jpg) |
| ricotta | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 640 | 102,775 | [Source](https://commons.wikimedia.org/wiki/File:Ricotte_fresche.jpg) |
| saffron | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | 640 × 960 | 119,570 | [Source](https://commons.wikimedia.org/wiki/File:Saffron_-_premium_spice.jpg) |
| sage | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 640 × 480 | 54,855 | [Source](https://commons.wikimedia.org/wiki/File:Salvia_officinalis0.jpg) |
| salmon | [Public domain](https://commons.wikimedia.org/wiki/File:Sockeye_salmon_fillets.png#Licensing) | 771 × 515 | 43,854 | [Source](https://commons.wikimedia.org/wiki/File:Sockeye_salmon_fillets.png) |
| sardines | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 720 | 98,442 | [Source](https://commons.wikimedia.org/wiki/File:2006_sardines_plate.jpg) |
| sesame-seeds | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 640 | 139,685 | [Source](https://commons.wikimedia.org/wiki/File:Sa_white_sesame_seeds.jpg) |
| shallot | [Public domain](https://commons.wikimedia.org/wiki/File:Shallots_-_sliced_and_whole.jpg#Licensing) | 770 × 498 | 93,096 | [Source](https://commons.wikimedia.org/wiki/File:Shallots_-_sliced_and_whole.jpg) |
| shrimp | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 720 | 177,436 | [Source](https://commons.wikimedia.org/wiki/File:Raw_shrimp.jpg) |
| spaghetti | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 720 × 960 | 116,191 | [Source](https://commons.wikimedia.org/wiki/File:Spaghettoni.jpg) |
| split-peas | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 641 | 218,485 | [Source](https://commons.wikimedia.org/wiki/File:Split_pea.jpg) |
| star-anise | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | 960 × 637 | 103,929 | [Source](https://commons.wikimedia.org/wiki/File:Star_anise.jpg) |
| sumac | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 658 × 501 | 74,013 | [Source](https://commons.wikimedia.org/wiki/File:Sumac.jpg) |
| sunflower-seeds | [Public domain](https://commons.wikimedia.org/wiki/File:Sunflower_Seeds_Kaldari.jpg#Licensing) | 960 × 640 | 62,658 | [Source](https://commons.wikimedia.org/wiki/File:Sunflower_Seeds_Kaldari.jpg) |
| tahini | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 721 | 123,197 | [Source](https://commons.wikimedia.org/wiki/File:Tahina.JPG) |
| tarragon | [Public domain](https://commons.wikimedia.org/wiki/File:Estragon_1511.jpg#Licensing) | 346 × 274 | 26,220 | [Source](https://commons.wikimedia.org/wiki/File:Estragon_1511.jpg) |
| thyme | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 526 | 115,994 | [Source](https://commons.wikimedia.org/wiki/File:Thyme-Bundle.jpg) |
| tofu | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 820 | 140,985 | [Source](https://commons.wikimedia.org/wiki/File:Japanese_SilkyTofu_(Kinugoshi_Tofu).JPG) |
| trout | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 800 × 357 | 50,637 | [Source](https://commons.wikimedia.org/wiki/File:Female_Rainbow_Trout_in_hand.JPG) |
| turmeric | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 395 | 71,497 | [Source](https://commons.wikimedia.org/wiki/File:Curcuma_longa_roots.jpg) |
| turnip | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 639 | 93,437 | [Source](https://commons.wikimedia.org/wiki/File:Turnip_2622027.jpg) |
| walnuts | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 84,704 | [Source](https://commons.wikimedia.org/wiki/File:Walnuts_-_whole_and_open_with_halved_kernel.jpg) |
| whipped-cream | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 638 | 62,129 | [Source](https://commons.wikimedia.org/wiki/File:Whipped_Cream.jpg) |
| white-onion | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 695 | 99,830 | [Source](https://commons.wikimedia.org/wiki/File:White_onions_for_sale_in_supermarket.JPG) |
| yoghurt | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 806 | 102,258 | [Source](https://commons.wikimedia.org/wiki/File:Joghurt.jpg) |
