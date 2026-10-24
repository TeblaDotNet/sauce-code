# Knowledge images — batch 4

100 more existing ingredient pages now have locally hosted, attributed images. Coverage rises from 249 to **349 of 911 enriched pages**, leaving **562** without images. This batch changes image metadata and assets only: no recipe, canonical identity, relationship, resource or knowledge prose changes.

The new files total **11,440,568 bytes (10.9 MiB)**. Each is an optimised progressive JPEG at quality 82, at most 960 pixels on its longest edge, without upscaling and below 350 KB. Full source frames are retained. Embedded metadata is removed; credits remain visible on the page and in the [asset attribution](../assets/references/ATTRIBUTION.md) and [batch ledger](knowledge-images-batch-4.json).

## Curation

All selected images were inspected visually. Wikimedia Commons file-specific metadata records the creator, source page, original file URL, exact licence version and jurisdiction where applicable. Licences are public domain, CC0, CC BY or CC BY-SA. Public-domain files without a separate licence URL link to the source licensing section. Wikipedia article lead images were only a discovery aid, not sufficient evidence of subject suitability or licensing.

Unsuitable lead images were rejected, including chemical structures for baking soda/sugar, an ear of rye for rye flour, bread for sourdough starter, whole chickens for specific chicken cuts, live animals for meat cuts and finished curry for curry paste. One Shaoxing-wine download remained rate-limited after bounded retries; that page was deferred and an already downloaded, reviewed crab-meat photograph was selected instead. No access restriction was bypassed.

Captions describe the actual presentation: raw versus cooked meats, a microscope view of yeast, a kombucha pellicle, sauces in containers or served with food, and prepared ramen or grits. Bottles illustrate named product categories and are not endorsements or new equivalence claims. The bourbon shelf includes other American whiskeys, and the caption explicitly says so. The tonic-water image compares ordinary and ultraviolet lighting; the currant image distinguishes small Zante currants from larger raisins. Agave remains the existing sweetener identity, illustrated by agave syrup.

## Preservation and checks

Regression tests pin all 100 new heroes, asset checksums and byte counts, safe rendering of credits, dimensions and supported licences. They reconstruct the complete previous enrichment registry by removing only this batch's additions and check all canonical files, resources and previous images against baseline hashes. Historical image-batch tests keep their original counts and snapshots.

- Core: type checking, build, 1,490 tests, documentation links (32 documents) and quality audit passed. The existing 10 sample quality findings remain unchanged.
- Corpus: 395 tests and all 490 recipe parses passed; Corpus sources untouched.
- Site: type checking, 128 tests, build and validation passed: 1,667 pages, 2,173 files, 66,811 internal links and 2,450 fragments.
- Clean-source export audit passed: 1,595 files, 969 knowledge entries and 14 samples. Unrelated user files and ignored archives were excluded and left untouched.
- Ordinary localhost audit passed: all 1,667 HTML pages matched built bytes; all 100 new images returned HTTP 200, image/jpeg and exact saved SHA-256 content. Captions, licence links, source links and derivative notices were checked. Four transient connection resets passed bounded transport-only retries; no status or content assertion was relaxed.
- Visual review: all 100 selected frames inspected, plus an ordinary in-app browser spot-check of mayonnaise confirming its photograph, caption and expanded source/licence credit. This is not a full browser suite or mobile/theme matrix.
- Git whitespace and preservation checks passed. Core and Site changes receive local commits on codex/knowledge-images-batch-4; no merge, push, publication or deployment.

## Pages

| Page | Licence | Dimensions | Bytes | Source |
| --- | --- | --- | --- | --- |
| absinthe | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 418 × 600 | 42,845 | [Source](https://commons.wikimedia.org/wiki/File:Absinthe-glass.jpg) |
| agave | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | 720 × 960 | 104,151 | [Source](https://commons.wikimedia.org/wiki/File:Agave_Syrup.jpg) |
| amaro | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 913 × 685 | 128,772 | [Source](https://commons.wikimedia.org/wiki/File:SomeAmari.jpg) |
| apple-juice | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 640 × 960 | 56,544 | [Source](https://commons.wikimedia.org/wiki/File:Apfelsaft_im_Glas.jpg) |
| baking-powder | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 956 × 960 | 138,718 | [Source](https://commons.wikimedia.org/wiki/File:BakingPowder.jpg) |
| balsamic-vinegar | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 960 × 640 | 44,582 | [Source](https://commons.wikimedia.org/wiki/File:Balsamic_vinegar_(drops).jpg) |
| bechamel | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 675 | 111,092 | [Source](https://commons.wikimedia.org/wiki/File:2021_Sos_beszamelowy.jpg) |
| beef | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 935 × 679 | 79,955 | [Source](https://commons.wikimedia.org/wiki/File:Standing-rib-roast.jpg) |
| beef-brisket | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 960 × 720 | 215,341 | [Source](https://commons.wikimedia.org/wiki/File:Brisketphoto.jpg) |
| beer | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 889 | 104,278 | [Source](https://commons.wikimedia.org/wiki/File:Jeju_beer_09_(cropped).jpg) |
| bouillon-cube | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 789 | 116,621 | [Source](https://commons.wikimedia.org/wiki/File:Br%C3%BChw%C3%BCrfel-1.jpg) |
| bourbon | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | 730 × 800 | 222,558 | [Source](https://commons.wikimedia.org/wiki/File:DecaturBourbons.jpg) |
| brandy | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 812 | 63,863 | [Source](https://commons.wikimedia.org/wiki/File:Cognac_glass.jpg) |
| butter | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 721 | 101,710 | [Source](https://commons.wikimedia.org/wiki/File:%C5%A0v%C3%A9dsk%C3%BD_kol%C3%A1%C4%8D_naruby_904_(cropped).JPG) |
| buttermilk | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 643 | 68,055 | [Source](https://commons.wikimedia.org/wiki/File:Buttermilk-(right)-and-Milk-(left).jpg) |
| champagne | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 640 × 960 | 70,431 | [Source](https://commons.wikimedia.org/wiki/File:Glass_of_champagne.jpg) |
| chicken | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 784 | 165,613 | [Source](https://commons.wikimedia.org/wiki/File:Chickens_in_market.jpg) |
| chinese-five-spice | [Public domain](https://commons.wikimedia.org/wiki/File:Five_spice_powder.jpg#Licensing) | 638 × 535 | 34,274 | [Source](https://commons.wikimedia.org/wiki/File:Five_spice_powder.jpg) |
| chipotle-peppers | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 911 × 960 | 159,924 | [Source](https://commons.wikimedia.org/wiki/File:Capsicum_annuum_chipotle_dried.jpg) |
| cider-vinegar | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 960 × 640 | 38,229 | [Source](https://commons.wikimedia.org/wiki/File:Apple_Cider_Vinegar_(4108653248).jpg) |
| coconut-milk | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 783 | 108,448 | [Source](https://commons.wikimedia.org/wiki/File:Cononut_milk.JPG) |
| coconut-oil | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 604 × 656 | 63,097 | [Source](https://commons.wikimedia.org/wiki/File:Coconut_and_oil.jpg) |
| cornflour | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 114,350 | [Source](https://commons.wikimedia.org/wiki/File:Cornstarch_mixed_with_water.jpg) |
| crab-meat | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 960 × 720 | 212,372 | [Source](https://commons.wikimedia.org/wiki/File:Ristet_br%C3%B8d_med_krabbekl%C3%B8er_(4898535215).jpg) |
| creme-fraiche | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 718 | 163,789 | [Source](https://commons.wikimedia.org/wiki/File:Cr%C3%A8me_d%27Isigny_2.JPG) |
| currants | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 677 | 138,901 | [Source](https://commons.wikimedia.org/wiki/File:Grape_Rasins_plus_Zante_Currants.jpg) |
| curry-powder | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 640 | 159,558 | [Source](https://commons.wikimedia.org/wiki/File:Curry_powder_in_the_spice-bazaar_in_Istanbul.jpg) |
| dukkah | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 637 | 107,575 | [Source](https://commons.wikimedia.org/wiki/File:Du%27ah_(dukkah)_-_Egyptian_spice_mix.JPG) |
| english-muffins | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | 960 × 720 | 125,727 | [Source](https://commons.wikimedia.org/wiki/File:Harborview_Bistro_%26_Bar_-_January_2024_-_Sarah_Stierch_08.jpg) |
| fish-sauce | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 906 | 127,157 | [Source](https://commons.wikimedia.org/wiki/File:Sauce_de_poisson.jpg) |
| garlic-powder | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 480 × 360 | 64,684 | [Source](https://commons.wikimedia.org/wiki/File:Ground-Garlic_31534-480x360_(4904476773).jpg) |
| gin | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 207,374 | [Source](https://commons.wikimedia.org/wiki/File:DecaturGins.jpg) |
| ginger-beer | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 149,973 | [Source](https://commons.wikimedia.org/wiki/File:Ginger_beer_bottle_assortment.jpg) |
| grenadine | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0) | 683 × 960 | 93,919 | [Source](https://commons.wikimedia.org/wiki/File:Grenadinesyrup.jpg) |
| grits | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 720 | 141,187 | [Source](https://commons.wikimedia.org/wiki/File:Grits1.jpg) |
| herbes-de-provence | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 242,995 | [Source](https://commons.wikimedia.org/wiki/File:Herbes_de_Provence_02.jpg) |
| hoisin-sauce | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 960 × 833 | 157,167 | [Source](https://commons.wikimedia.org/wiki/File:Hoisin_sauce_1.jpg) |
| hot-sauce | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 640 × 960 | 65,044 | [Source](https://commons.wikimedia.org/wiki/File:Fermented_hot_sauce.jpg) |
| ice-cream | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 427 × 640 | 39,745 | [Source](https://commons.wikimedia.org/wiki/File:Vanilla_Ice_Cream_Cone_at_Camp_Manitoulin.jpg) |
| icing-sugar | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 540 | 37,285 | [Source](https://commons.wikimedia.org/wiki/File:Powdered_Sugar_-_Macro.jpg) |
| jam | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 377 | 74,194 | [Source](https://commons.wikimedia.org/wiki/File:Fruits_jam_variants.jpg) |
| ketchup | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | 960 × 822 | 156,543 | [Source](https://commons.wikimedia.org/wiki/File:Ketchup_20160918_181342_(cropped).jpg) |
| kombucha-scoby | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 79,652 | [Source](https://commons.wikimedia.org/wiki/File:SCOBY_mushroom.jpg) |
| lamb | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 894 | 237,173 | [Source](https://commons.wikimedia.org/wiki/File:Lamb_meat_(1).jpg) |
| lard | [CC BY 2.5](https://creativecommons.org/licenses/by/2.5) | 960 × 657 | 95,704 | [Source](https://commons.wikimedia.org/wiki/File:Homelard.jpg) |
| liquid-smoke | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 534 | 46,704 | [Source](https://commons.wikimedia.org/wiki/File:Liquid_Smoke_Spoonful.jpg) |
| marmalade | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 720 × 960 | 75,613 | [Source](https://commons.wikimedia.org/wiki/File:Homemade_marmalade,_England.jpg) |
| mayonnaise | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 639 | 83,673 | [Source](https://commons.wikimedia.org/wiki/File:Mayonnaise_(1).jpg) |
| mezcal | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 643 | 202,385 | [Source](https://commons.wikimedia.org/wiki/File:Mezcal_bottles_.jpg) |
| msg | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 639 | 68,926 | [Source](https://commons.wikimedia.org/wiki/File:Monosodium_glutamate_crystals.jpg) |
| mustard | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 635 | 197,125 | [Source](https://commons.wikimedia.org/wiki/File:Mustard.JPG) |
| octopus | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 720 | 219,461 | [Source](https://commons.wikimedia.org/wiki/File:Octopuses_in_Tsukiji.JPG) |
| old-bay-seasoning | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 640 × 960 | 70,057 | [Source](https://commons.wikimedia.org/wiki/File:Old_Bay_Seasoning.jpg) |
| olive-oil | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 896 | 65,392 | [Source](https://commons.wikimedia.org/wiki/File:Oliven_V1.jpg) |
| onion-powder | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 103,795 | [Source](https://commons.wikimedia.org/wiki/File:Onion_Powder,_Penzeys_Spices,_Arlington_Heights_MA.jpg) |
| orange-juice | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 641 × 960 | 90,044 | [Source](https://commons.wikimedia.org/wiki/File:Orangejuice.jpg) |
| orange-liqueur | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 574 × 960 | 106,605 | [Source](https://commons.wikimedia.org/wiki/File:Triple_Sec.jpg) |
| orgeat | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 720 × 960 | 141,766 | [Source](https://commons.wikimedia.org/wiki/File:Orgeat_syrup_flavored_drinks.jpg) |
| oyster-sauce | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 45,300 | [Source](https://commons.wikimedia.org/wiki/File:OysterSauce2.jpg) |
| peanut-oil | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 800 × 600 | 81,039 | [Source](https://commons.wikimedia.org/wiki/File:4_gallons_of_peanut_oil.jpg) |
| plum-tomato | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 78,874 | [Source](https://commons.wikimedia.org/wiki/File:Plum_Tomatoes,_Lexington_MA.jpg) |
| pork | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 639 | 99,199 | [Source](https://commons.wikimedia.org/wiki/File:Schweinebauch-2.jpg) |
| pork-chop | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 720 | 142,465 | [Source](https://commons.wikimedia.org/wiki/File:Pork_chops_167541218.jpg) |
| pork-shoulder | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 640 | 104,581 | [Source](https://commons.wikimedia.org/wiki/File:Boston_butt_,_boneless,_tied.jpg) |
| puff-pastry | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 960 | 208,745 | [Source](https://commons.wikimedia.org/wiki/File:Pate_feuilletee_2.jpg) |
| quark | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 768 | 57,701 | [Source](https://commons.wikimedia.org/wiki/File:Skimmed_milk_quark_on_spoon.jpg) |
| ramen-noodles | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 192,739 | [Source](https://commons.wikimedia.org/wiki/File:Shoyu_Ramen%EF%BC%88Tokyo_Ramen%EF%BC%89_-_01.jpg) |
| red-pepper-flakes | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 960 | 152,251 | [Source](https://commons.wikimedia.org/wiki/File:2014_Dried_chilli_flakes.jpg) |
| rice-vinegar | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 960 | 88,442 | [Source](https://commons.wikimedia.org/wiki/File:Rice_vinegar.jpg) |
| rookworst | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 720 | 116,872 | [Source](https://commons.wikimedia.org/wiki/File:Boerenkool_met_worst.jpg) |
| rum | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 451 × 700 | 48,096 | [Source](https://commons.wikimedia.org/wiki/File:A_glass_of_rum.jpg) |
| salt-pork | [Public domain](https://commons.wikimedia.org/wiki/File:Saltpork.jpg#Licensing) | 960 × 720 | 115,334 | [Source](https://commons.wikimedia.org/wiki/File:Saltpork.jpg) |
| savoiardi-biscuits | [Public domain](https://commons.wikimedia.org/wiki/File:Biskotten-02.jpg#Licensing) | 960 × 720 | 107,824 | [Source](https://commons.wikimedia.org/wiki/File:Biskotten-02.jpg) |
| scamorza-cheese | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 586 × 960 | 78,937 | [Source](https://commons.wikimedia.org/wiki/File:Scamorza_chez_un_fromager.jpg) |
| scotch-whisky | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 720 × 960 | 89,706 | [Source](https://commons.wikimedia.org/wiki/File:Bowmore_whisky_12_years.JPG) |
| seafood | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 960 | 221,591 | [Source](https://commons.wikimedia.org/wiki/File:Plateau_van_zeevruchten.jpg) |
| serrano-chilies | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 718 × 960 | 240,239 | [Source](https://commons.wikimedia.org/wiki/File:Serranochilis.jpg) |
| sesame-oil | [Public domain](https://commons.wikimedia.org/wiki/File:SesameSeedOil.png#Licensing) | 643 × 960 | 18,699 | [Source](https://commons.wikimedia.org/wiki/File:SesameSeedOil.png) |
| snail | [Public domain](https://commons.wikimedia.org/wiki/File:Caracoles-del-restaurante-granero.jpg#Licensing) | 700 × 525 | 66,386 | [Source](https://commons.wikimedia.org/wiki/File:Caracoles-del-restaurante-granero.jpg) |
| soy-sauce | [CC BY-SA 2.0 kr](https://creativecommons.org/licenses/by-sa/2.0/kr/deed.en) | 960 × 804 | 41,518 | [Source](https://commons.wikimedia.org/wiki/File:Soy_sauce_2.jpg) |
| sriracha | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 720 × 960 | 58,179 | [Source](https://commons.wikimedia.org/wiki/File:Siracha_sauce.jpg) |
| stock | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 670 | 196,447 | [Source](https://commons.wikimedia.org/wiki/File:Making_stock_for_pho_bo.jpg) |
| toast | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | 960 × 879 | 172,730 | [Source](https://commons.wikimedia.org/wiki/File:Toast-3.jpg) |
| tomato-paste | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 720 | 80,492 | [Source](https://commons.wikimedia.org/wiki/File:Tomato_paste_on_spoon.jpg) |
| tomato-sauce | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 640 | 135,228 | [Source](https://commons.wikimedia.org/wiki/File:Fresh_Tomato_Sauce_(Unsplash).jpg) |
| tonic-water | [Public domain](https://commons.wikimedia.org/wiki/File:Tonic_water_uv.jpg#Licensing) | 960 × 960 | 135,392 | [Source](https://commons.wikimedia.org/wiki/File:Tonic_water_uv.jpg) |
| turkey | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0) | 960 × 720 | 133,373 | [Source](https://commons.wikimedia.org/wiki/File:Thanksgiving_Turkey.jpg) |
| vanilla-extract | [Public domain](https://commons.wikimedia.org/wiki/File:VanillaExtract.png#Licensing) | 643 × 960 | 18,913 | [Source](https://commons.wikimedia.org/wiki/File:VanillaExtract.png) |
| vanilla-sugar | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 700 × 763 | 88,701 | [Source](https://commons.wikimedia.org/wiki/File:Vanillezucker.jpg) |
| venison | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0) | 850 × 629 | 57,991 | [Source](https://commons.wikimedia.org/wiki/File:Venison_Steaks.jpg) |
| vermicelli | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 681 | 171,340 | [Source](https://commons.wikimedia.org/wiki/File:Fideo_(coiled_vermicelli).JPG) |
| vermouth | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 809 | 185,010 | [Source](https://commons.wikimedia.org/wiki/File:Four_bottles_of_vermouth.jpg) |
| vinegar | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 640 | 203,221 | [Source](https://commons.wikimedia.org/wiki/File:Eguilles_20110828_14.jpg) |
| vodka | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0) | 640 × 960 | 55,733 | [Source](https://commons.wikimedia.org/wiki/File:Smirnoff_Red_Label_8213.jpg) |
| white-wine | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 401 × 800 | 35,417 | [Source](https://commons.wikimedia.org/wiki/File:White_Wine_Glas.jpg) |
| wine | [CC BY-SA 2.5](https://creativecommons.org/licenses/by-sa/2.5) | 829 × 800 | 66,397 | [Source](https://commons.wikimedia.org/wiki/File:Red_and_white_wine_in_glass.jpg) |
| worcestershire-sauce | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 960 × 638 | 99,574 | [Source](https://commons.wikimedia.org/wiki/File:Worcester_Sauce_001.jpg) |
| yeast | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0) | 960 × 960 | 227,776 | [Source](https://commons.wikimedia.org/wiki/File:20100911_232323_Yeast_Live.jpg) |
| yukon-potato | [CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.en) | 250 × 250 | 23,243 | [Source](https://commons.wikimedia.org/wiki/File:Yukon-gold-potatoes.jpg) |
| za-atar | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0) | 960 × 739 | 196,158 | [Source](https://commons.wikimedia.org/wiki/File:Closeup_image_of_za%27atar,_a_blend_of_origanum_syriacum_(hyssop,_sumac,_sesame_seeds_and_salt.jpg) |
