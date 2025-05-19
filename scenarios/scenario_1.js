const scenario_1 = {}
export default scenario_1

scenario_1.id = 'scenario_1'
scenario_1.title = 'sc1_scenario_title'
scenario_1.desc = 'sc1_scenario_desc'

scenario_1.elems = [
	
	//////
	
	{ id:'mission_rocket_launch', type:'mission', label:'sc1_mission_rocket_launch', desc:'sc1_mission_rocket_launch_desc', max:1 },
		{ id:'mission_rocket_launch_manual', type:'manual', itemId:'mission_rocket_launch', output:1, seconds:120, inputs:[{ id:'rocket_part', count:100 }] },
	
	//////
	
	{ id:'mission_steam_tech', type:'tech', group:'power', label:'sc1_mission_steam_tech', desc:'sc1_mission_steam_tech_desc', max:1 },
		{ id:'mission_steam_tech_manual', type:'manual', itemId:'mission_steam_tech', output:1, seconds:0.5, inputs:[{ id:'iron_plate', count:50 }] },

	//////

	{ id:'mission_red_science', type:'tech', group:'science', label:'sc1_mission_red_science', desc:'sc1_mission_red_science_desc', max:1 },
		{ id:'mission_red_science_manual', type:'manual', itemId:'mission_red_science', output:1, seconds:0.5, inputs:[{ id:'iron_plate', count:36 },{ id:'copper_plate', count:15 }] },

	{ id:'mission_green_science', type:'tech', group:'science', label:'sc1_mission_green_science', desc:'sc1_mission_green_science_desc', max:75 },
		{ id:'mission_green_science_manual', type:'manual', itemId:'mission_green_science', counts:[ 1, 5, 10, 50 ], output:1, seconds:5, inputs:[{ id:'red_pack', count:1 }] },

	{ id:'mission_blue_science', type:'tech', group:'science', label:'sc1_mission_blue_science', desc:'sc1_mission_blue_science_desc', max:75 },
		{ id:'mission_blue_science_manual', type:'manual', itemId:'mission_blue_science', counts:[ 1, 5, 10, 50 ], output:1, seconds:10, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_purple_science', type:'tech', group:'science', label:'sc1_mission_purple_science', desc:'sc1_mission_purple_science_desc', max:100 },
		{ id:'mission_purple_science_manual', type:'manual', itemId:'mission_purple_science', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },

	{ id:'mission_yellow_science', type:'tech', group:'science', label:'sc1_mission_yellow_science', desc:'sc1_mission_yellow_science_desc', max:100 },
		{ id:'mission_yellow_science_manual', type:'manual', itemId:'mission_yellow_science', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },

	//////

	{ id:'mission_automation_1_tech', type:'tech', group:'production', label:'sc1_mission_automation_1_tech', desc:'sc1_mission_automation_1_tech_desc', max:10 },
		{ id:'mission_automation_1_tech_manual', type:'manual', itemId:'mission_automation_1_tech', counts:[ 1, 5, 10 ], output:1, seconds:10, inputs:[{ id:'red_pack', count:1 }] },
	
	{ id:'mission_automation_2_tech', type:'tech', group:'production', label:'sc1_mission_automation_2_tech', desc:'sc1_mission_automation_2_tech_desc', max:50 },
		{ id:'mission_automation_2_tech_manual', type:'manual', itemId:'mission_automation_2_tech', counts:[ 1, 5, 10, 50 ], output:1, seconds:15, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	//////

	{ id:'mission_steel_tech', type:'tech', group:'items', label:'sc1_mission_steel_tech', desc:'sc1_mission_steel_tech_desc', max:50 },
		{ id:'mission_steel_tech_manual', type:'manual', itemId:'mission_steel_tech', counts:[ 1, 5, 10, 50 ], output:1, seconds:5, inputs:[{ id:'red_pack', count:1 }] },

	{ id:'mission_engine_1_tech', type:'tech', group:'items', label:'sc1_mission_engine_1_tech', desc:'sc1_mission_engine_1_tech_desc', max:100 },	
		{ id:'mission_engine_1_tech_manual', type:'manual', itemId:'mission_engine_1_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:15, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_oil_tech_1', type:'tech', group:'items', label:'sc1_mission_oil_tech_1', desc:'sc1_mission_oil_tech_1_desc', max:100 },
		{ id:'mission_oil_tech_1_manual', type:'manual', itemId:'mission_oil_tech_1', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_oil_tech_2', type:'tech', group:'items', label:'sc1_mission_oil_tech_2', desc:'sc1_mission_oil_tech_2_desc', max:1 },
		{ id:'mission_oil_tech_2_manual', type:'manual', itemId:'mission_oil_tech_2', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:0.5, inputs:[{ id:'oil', count:100 }] },

	{ id:'mission_sulfur_tech', type:'tech', group:'items', label:'sc1_mission_sulfur_tech', desc:'sc1_mission_sulfur_tech_desc', max:150 },
		{ id:'mission_sulfur_tech_manual', type:'manual', itemId:'mission_sulfur_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_battery_tech', type:'tech', group:'items', label:'sc1_mission_battery_tech', desc:'sc1_mission_battery_tech_desc', max:150 },
		{ id:'mission_battery_tech_manual', type:'manual', itemId:'mission_battery_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_plastic_tech', type:'tech', group:'items', label:'sc1_mission_plastic_tech', desc:'sc1_mission_plastic_tech_desc', max:200 },
		{ id:'mission_plastic_tech_manual', type:'manual', itemId:'mission_plastic_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_concrete_tech', type:'tech', group:'items', label:'sc1_mission_concrete_tech', desc:'sc1_mission_concrete_tech_desc', max:250 },
		{ id:'mission_concrete_tech_manual', type:'manual', itemId:'mission_concrete_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 }] },

	{ id:'mission_lubricant_tech', type:'tech', group:'items', label:'sc1_mission_lubricant_tech', desc:'sc1_mission_lubricant_tech_desc', max:50 },	
		{ id:'mission_lubricant_tech_manual', type:'manual', itemId:'mission_lubricant_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },

	{ id:'mission_engine_2_tech', type:'tech', group:'items', label:'sc1_mission_engine_2_tech', desc:'sc1_mission_engine_2_tech_desc', max:50 },
		{ id:'mission_engine_2_tech_manual', type:'manual', itemId:'mission_engine_2_tech', counts:[ 1, 5, 10, 50 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },

	{ id:'mission_oil_tech_3', type:'tech', group:'items', label:'sc1_mission_oil_tech_3', desc:'sc1_mission_oil_tech_3_desc', max:75 },	
		{ id:'mission_oil_tech_3_manual', type:'manual', itemId:'mission_oil_tech_3', counts:[ 1, 5, 10, 50 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },

	{ id:'mission_circuit_tech', type:'tech', group:'items', label:'sc1_mission_circuit_tech', desc:'sc1_mission_circuit_tech_desc', max:300 },	
		{ id:'mission_circuit_tech_manual', type:'manual', itemId:'mission_circuit_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:30, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },
		
	{ id:'mission_rocket_fuel_tech', type:'tech', group:'items', label:'sc1_mission_rocket_fuel_tech', desc:'sc1_mission_rocket_fuel_tech_desc', max:300 },	
		{ id:'mission_rocket_fuel_tech_manual', type:'manual', itemId:'mission_rocket_fuel_tech', counts:[ 1, 5, 10, 50, 100 ], output:1, seconds:45, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 }] },

	{ id:'mission_rocket_tech', type:'tech', group:'items', label:'sc1_mission_rocket_tech', desc:'sc1_mission_rocket_tech_desc', max:1000 },
		{ id:'mission_rocket_tech_manual', type:'manual', itemId:'mission_rocket_tech', counts:[ 1, 5, 10, 50, 100, 500, 1000 ], output:1, seconds:60, inputs:[{ id:'red_pack', count:1 },{ id:'green_pack', count:1 },{ id:'blue_pack', count:1 },{ id:'purple_pack', count:1 },{ id:'yellow_pack', count:1 }] },
	
	//////
	
	{ id:'tab_items', type:'tab', label:'sc1_tab_items', icon:'i-lucide-boxes' },
	
		{ id:'entry_energy', type:'entry', parentId:'tab_items', label:'sc1_entry_energy' },
		
			{ id:'page_coal', type:'page', parentId:'entry_energy', label:'sc1_coal', itemId:'coal', link:'/item/coal' },
			{ id:'page_water', type:'page', parentId:'entry_energy', label:'sc1_water', itemId:'water', link:'/item/water' },
			{ id:'page_steam', type:'page', parentId:'entry_energy', label:'sc1_steam', itemId:'steam', link:'/item/steam' },
			{ id:'page_elec', type:'page', parentId:'entry_energy', label:'sc1_elec', itemId:'elec', link:'/item/elec' },
			
		{ id:'entry_extracted', type:'entry', parentId:'tab_items', label:'sc1_entry_extracted' },
		
			{ id:'page_stone', type:'page', parentId:'entry_extracted', label:'sc1_stone', itemId:'stone', link:'/item/stone' },
			{ id:'page_iron', type:'page', parentId:'entry_extracted', label:'sc1_iron', itemId:'iron', link:'/item/iron' },
			{ id:'page_copper', type:'page', parentId:'entry_extracted', label:'sc1_copper', itemId:'copper', link:'/item/copper' },
			{ id:'page_oil', type:'page', parentId:'entry_extracted', label:'sc1_oil', itemId:'oil', link:'/item/oil' },
			
		{ id:'entry_smelted', type:'entry', parentId:'tab_items', label:'sc1_entry_smelted' },

			{ id:'page_brick', type:'page', parentId:'entry_smelted', label:'sc1_brick', itemId:'brick', link:'/item/brick' },
			{ id:'page_iron_plate', type:'page', parentId:'entry_smelted', label:'sc1_iron_plate', itemId:'iron_plate', link:'/item/iron_plate' },
			{ id:'page_copper_plate', type:'page', parentId:'entry_smelted', label:'sc1_copper_plate', itemId:'copper_plate', link:'/item/copper_plate' },
			{ id:'page_steel', type:'page', parentId:'entry_smelted', label:'sc1_steel', itemId:'steel', link:'/item/steel' },
			
		{ id:'entry_chemistry', type:'entry', parentId:'tab_items', label:'sc1_entry_chemistry' },

			{ id:'page_petrol', type:'page', parentId:'entry_chemistry', label:'sc1_petrol', itemId:'petrol', link:'/item/petrol' },
			{ id:'page_plastic', type:'page', parentId:'entry_chemistry', label:'sc1_plastic', itemId:'plastic', link:'/item/plastic' },
			{ id:'page_sulfur', type:'page', parentId:'entry_chemistry', label:'sc1_sulfur', itemId:'sulfur', link:'/item/sulfur' },
			{ id:'page_acid', type:'page', parentId:'entry_chemistry', label:'sc1_acid', itemId:'acid', link:'/item/acid' },
			{ id:'page_battery', type:'page', parentId:'entry_chemistry', label:'sc1_battery', itemId:'battery', link:'/item/battery' },
			{ id:'page_heavy_oil', type:'page', parentId:'entry_chemistry', label:'sc1_heavy_oil', itemId:'heavy_oil', link:'/item/heavy_oil' },
			{ id:'page_light_oil', type:'page', parentId:'entry_chemistry', label:'sc1_light_oil', itemId:'light_oil', link:'/item/light_oil' },
			{ id:'page_solid_fuel', type:'page', parentId:'entry_chemistry', label:'sc1_solid_fuel', itemId:'solid_fuel', link:'/item/solid_fuel' },
			{ id:'page_lubricant', type:'page', parentId:'entry_chemistry', label:'sc1_lubricant', itemId:'lubricant', link:'/item/lubricant' },
			
		{ id:'entry_sciences', type:'entry', parentId:'tab_items', label:'sc1_entry_sciences' },

			{ id:'page_red_pack', type:'page', parentId:'entry_sciences', label:'sc1_red_pack', itemId:'red_pack', link:'/item/red_pack' },
			{ id:'page_green_pack', type:'page', parentId:'entry_sciences', label:'sc1_green_pack', itemId:'green_pack', link:'/item/green_pack' },
			{ id:'page_blue_pack', type:'page', parentId:'entry_sciences', label:'sc1_blue_pack', itemId:'blue_pack', link:'/item/blue_pack' },
			{ id:'page_purple_pack', type:'page', parentId:'entry_sciences', label:'sc1_purple_pack', itemId:'purple_pack', link:'/item/purple_pack' },
			{ id:'page_yellow_pack', type:'page', parentId:'entry_sciences', label:'sc1_yellow_pack', itemId:'yellow_pack', link:'/item/yellow_pack' },
		
		{ id:'entry_products', type:'entry', parentId:'tab_items', label:'sc1_entry_products' },

			{ id:'page_engine_1', type:'page', parentId:'entry_products', label:'sc1_engine_1', itemId:'engine_1', link:'/item/engine_1' },
			{ id:'page_engine_2', type:'page', parentId:'entry_products', label:'sc1_engine_2', itemId:'engine_2', link:'/item/engine_2' },
			{ id:'page_concrete', type:'page', parentId:'entry_products', label:'sc1_concrete', itemId:'concrete', link:'/item/concrete' },
			{ id:'page_circuit', type:'page', parentId:'entry_products', label:'sc1_circuit', itemId:'circuit', link:'/item/circuit' },
			{ id:'page_rocket_fuel', type:'page', parentId:'entry_products', label:'sc1_rocket_fuel', itemId:'rocket_fuel', link:'/item/rocket_fuel' },
			{ id:'page_rocket_part', type:'page', parentId:'entry_products', label:'sc1_rocket_part', itemId:'rocket_part', link:'/item/rocket_part' },

	{ id:'tab_buildings', type:'tab', label:'sc1_tab_buildings', icon:'i-lucide-building' },
	
		{ id:'entry_storers', type:'entry', parentId:'tab_buildings', label:'sc1_entry_storers' },
		
			{ id:'page_chest', type:'page', parentId:'entry_storers', label:'sc1_chest', itemId:'chest', link:'/item/chest' },
			{ id:'page_tank', type:'page', parentId:'entry_storers', label:'sc1_tank', itemId:'tank', link:'/item/tank' },
			{ id:'page_accumulator', type:'page', parentId:'entry_storers', label:'sc1_accumulator', itemId:'accumulator', link:'/item/accumulator' },
			{ id:'page_barrel', type:'page', parentId:'entry_storers', label:'sc1_barrel', itemId:'barrel', link:'/item/barrel' },

		{ id:'entry_machines', type:'entry', parentId:'tab_buildings', label:'sc1_entry_machines' },

			{ id:'page_furnace', type:'page', parentId:'entry_machines', label:'sc1_furnace', itemId:'furnace', link:'/item/furnace' },
			{ id:'page_miner', type:'page', parentId:'entry_machines', label:'sc1_miner', itemId:'miner', link:'/item/miner' },
			{ id:'page_pump', type:'page', parentId:'entry_machines', label:'sc1_pump', itemId:'pump', link:'/item/pump' },
			{ id:'page_boiler', type:'page', parentId:'entry_machines', label:'sc1_boiler', itemId:'boiler', link:'/item/boiler' },
			{ id:'page_steam_engine', type:'page', parentId:'entry_machines', label:'sc1_steam_engine', itemId:'steam_engine', link:'/item/steam_engine' },
			{ id:'page_lab', type:'page', parentId:'entry_machines', label:'sc1_lab', itemId:'lab', link:'/item/lab' },
			{ id:'page_assembler_1', type:'page', parentId:'entry_machines', label:'sc1_assembler_1', itemId:'assembler_1', link:'/item/assembler_1' },
			{ id:'page_assembler_2', type:'page', parentId:'entry_machines', label:'sc1_assembler_2', itemId:'assembler_2', link:'/item/assembler_2' },
			{ id:'page_pumpjack', type:'page', parentId:'entry_machines', label:'sc1_pumpjack', itemId:'pumpjack', link:'/item/pumpjack' },
			{ id:'page_refinery', type:'page', parentId:'entry_machines', label:'sc1_refinery', itemId:'refinery', link:'/item/refinery' },
			{ id:'page_chemical_plant', type:'page', parentId:'entry_machines', label:'sc1_chemical_plant', itemId:'chemical_plant', link:'/item/chemical_plant' },
			{ id:'page_rocket_silo', type:'page', parentId:'entry_machines', label:'sc1_rocket_silo', itemId:'rocket_silo', link:'/item/rocket_silo' },

	//////
	
	{ id:'coal', type:'item', label:'sc1_coal', img:'/fgfactory/sc1/coal.png', stack:50 },
		
		{ id:'coal_storage', type:'storage', itemId:'coal', assignId:'chest', slots:16 },
		{ id:'coal_manual', type:'manual', itemId:'coal', counts:[ 1, 5 ], output:1, seconds:4 },
		{ id:'coal_production', type:'production', itemId:'coal', assignId:'miner', output:1, seconds:5 },
	
	{ id:'water', type:'item', label:'sc1_water', img:'/fgfactory/sc1/water.png', stack:25000, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'water_storage', type:'storage', itemId:'water', assignId:'tank', slots:1 },
		{ id:'water_production', type:'production', itemId:'water', assignId:'pump', output:60, seconds:1 },
	
	{ id:'steam', type:'item', label:'sc1_steam', img:'/fgfactory/sc1/steam.png', stack:25000, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'steam_storage', type:'storage', itemId:'steam', assignId:'tank', slots:1 },
		{ id:'steam_production', type:'production', itemId:'steam', assignId:'boiler', output:60, seconds:1, inputs:[{ id:'coal', count:0.45 },{ id:'water', count:60 }] },
	
	{ id:'elec', type:'item', label:'sc1_elec', img:'/fgfactory/sc1/elec.png', stack:5000, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'elec_storage', type:'storage', itemId:'elec', assignId:'accumulator', slots:1 },
		{ id:'elec_production', type:'production', itemId:'elec', assignId:'steam_engine', output:900, seconds:1, inputs:[{ id:'steam', count:30 }] },
	
	{ id:'stone', type:'item', label:'sc1_stone', img:'/fgfactory/sc1/stone.png', stack:50 },
		
		{ id:'stone_storage', type:'storage', itemId:'stone', assignId:'chest', slots:16 },
		{ id:'stone_manual', type:'manual', itemId:'stone', counts:[ 1, 5 ], output:1, seconds:4 },
		{ id:'stone_production', type:'production', itemId:'stone', assignId:'miner', output:1, seconds:4, inputs:[{ id:'coal', count:0.15 }] },

	{ id:'iron', type:'item', label:'sc1_iron', img:'/fgfactory/sc1/iron.png', stack:50 },
		
		{ id:'iron_storage', type:'storage', itemId:'iron', assignId:'chest', slots:16 },
		{ id:'iron_manual', type:'manual', itemId:'iron', counts:[ 1, 5 ], output:1, seconds:4 },
		{ id:'iron_production', type:'production', itemId:'iron', assignId:'miner', output:1, seconds:4, inputs:[{ id:'coal', count:0.15 }] },
		
	{ id:'copper', type:'item', label:'sc1_copper', img:'/fgfactory/sc1/copper.png', stack:50 },
		
		{ id:'copper_storage', type:'storage', itemId:'copper', assignId:'chest', slots:16 },
		{ id:'copper_manual', type:'manual', itemId:'copper', counts:[ 1, 5 ], output:1, seconds:4 },
		{ id:'copper_production', type:'production', itemId:'copper', assignId:'miner', output:1, seconds:4, inputs:[{ id:'coal', count:0.15 }] },
		
	{ id:'oil', type:'item', label:'sc1_oil', img:'/fgfactory/sc1/oil.png', stack:1000, reqs:[{ id:'mission_oil_tech_1', count:100 }] },
		
		{ id:'oil_storage', type:'storage', itemId:'oil', assignId:'barrel', slots:1 },
		{ id:'oil_production', type:'production', itemId:'oil', assignId:'pumpjack', output:10, seconds:1, inputs:[{ id:'elec', count:90 }] },

	{ id:'brick', type:'item', label:'sc1_brick', img:'/fgfactory/sc1/brick.png', stack:100 },
		
		{ id:'brick_storage', type:'storage', itemId:'brick', assignId:'chest', slots:16 },
		{ id:'brick_production', type:'production', itemId:'brick', assignId:'furnace', output:1, seconds:3.2, inputs:[{ id:'coal', count:0.07 },{ id:'stone', count:2 }] },

	{ id:'iron_plate', type:'item', label:'sc1_iron_plate', img:'/fgfactory/sc1/iron_plate.png', stack:100 },
		
		{ id:'iron_plate_storage', type:'storage', itemId:'iron_plate', assignId:'chest', slots:16 },
		{ id:'iron_plate_production', type:'production', itemId:'iron_plate', assignId:'furnace', output:1, seconds:3.2, inputs:[{ id:'coal', count:0.07 },{ id:'iron', count:1 }] },

	{ id:'copper_plate', type:'item', label:'sc1_copper_plate', img:'/fgfactory/sc1/copper_plate.png', stack:100 },
		
		{ id:'copper_plate_storage', type:'storage', itemId:'copper_plate', assignId:'chest', slots:16 },
		{ id:'copper_plate_production', type:'production', itemId:'copper_plate', assignId:'furnace', output:1, seconds:3.2, inputs:[{ id:'coal', count:0.07 },{ id:'copper', count:1 }] },

	{ id:'steel', type:'item', label:'sc1_steel', img:'/fgfactory/sc1/steel.png', stack:100, reqs:[{ id:'mission_steel_tech', count:50 }] },
		
		{ id:'steel_storage', type:'storage', itemId:'steel', assignId:'chest', slots:16 },
		{ id:'steel_production', type:'production', itemId:'steel', assignId:'furnace', output:1, seconds:16, inputs:[{ id:'coal', count:0.36 },{ id:'iron_plate', count:5 }] },

	{ id:'petrol', type:'item', label:'sc1_petrol', img:'/fgfactory/sc1/petrol.png', stack:1000, reqs:[{ id:'mission_oil_tech_2', count:1 }] },
		
		{ id:'petrol_storage', type:'storage', itemId:'petrol', assignId:'barrel', slots:1 },
		{ id:'petrol_production', type:'production', itemId:'petrol', assignId:'refinery', output:45, seconds:5, inputs:[{ id:'elec', count:2100 },{ id:'oil', count:100 }] },
		
	{ id:'plastic', type:'item', label:'sc1_plastic', img:'/fgfactory/sc1/plastic.png', stack:100, reqs:[{ id:'mission_plastic_tech', count:200 }] },
		
		{ id:'plastic_storage', type:'storage', itemId:'plastic', assignId:'chest', slots:16 },
		{ id:'plastic_production', type:'production', itemId:'plastic', assignId:'chemical_plant', output:2, seconds:1, inputs:[{ id:'elec', count:210 },{ id:'coal', count:1 },{ id:'petrol', count:20 }] },
		
	{ id:'sulfur', type:'item', label:'sc1_sulfur', img:'/fgfactory/sc1/sulfur.png', stack:50, reqs:[{ id:'mission_sulfur_tech', count:150 }] },
		
		{ id:'sulfur_storage', type:'storage', itemId:'sulfur', assignId:'chest', slots:16 },
		{ id:'sulfur_production', type:'production', itemId:'sulfur', assignId:'chemical_plant', output:2, seconds:1, inputs:[{ id:'elec', count:210 },{ id:'water', count:30 },{ id:'petrol', count:30 }] },
		
	{ id:'acid', type:'item', label:'sc1_acid', img:'/fgfactory/sc1/acid.png', stack:1000, reqs:[{ id:'mission_sulfur_tech', count:150 }] },
		
		{ id:'acid_storage', type:'storage', itemId:'acid', assignId:'barrel', slots:1 },
		{ id:'acid_production', type:'production', itemId:'acid', assignId:'chemical_plant', output:50, seconds:1, inputs:[{ id:'elec', count:210 },{ id:'water', count:100 },{ id:'iron_plate', count:1 },{ id:'sulfur', count:5 }] },
		
	{ id:'battery', type:'item', label:'sc1_battery', img:'/fgfactory/sc1/battery.png', stack:200, reqs:[{ id:'mission_battery_tech', count:150 }] },
		
		{ id:'battery_storage', type:'storage', itemId:'battery', assignId:'chest', slots:16 },
		{ id:'battery_production', type:'production', itemId:'battery', assignId:'chemical_plant', output:1, seconds:4, inputs:[{ id:'elec', count:840 },{ id:'iron_plate', count:1 },{ id:'copper_plate', count:1 },{ id:'acid', count:20 }] },
		
	{ id:'heavy_oil', type:'item', label:'sc1_heavy_oil', img:'/fgfactory/sc1/heavy_oil.png', stack:1000, reqs:[{ id:'mission_oil_tech_2', count:1 }] },
		
		{ id:'heavy_oil_storage', type:'storage', itemId:'heavy_oil', assignId:'barrel', slots:1 },
		{ id:'heavy_oil_production', type:'production', itemId:'heavy_oil', assignId:'refinery', output:25, seconds:5, inputs:[{ id:'elec', count:1050 },{ id:'water', count:50 },{ id:'oil', count:100 }] },
		
	{ id:'light_oil', type:'item', label:'sc1_light_oil', img:'/fgfactory/sc1/light_oil.png', stack:1000, reqs:[{ id:'mission_oil_tech_2', count:1 }] },
		
		{ id:'light_oil_storage', type:'storage', itemId:'light_oil', assignId:'barrel', slots:1 },
		{ id:'light_oil_production', type:'production', itemId:'light_oil', assignId:'refinery', output:45, seconds:5, inputs:[{ id:'elec', count:1050 },{ id:'water', count:50 },{ id:'oil', count:100 }] },
		
	{ id:'solid_fuel', type:'item', label:'sc1_solid_fuel', img:'/fgfactory/sc1/solid_fuel.png', stack:50, reqs:[{ id:'mission_oil_tech_3', count:75 }] },
		
		{ id:'solid_fuel_storage', type:'storage', itemId:'solid_fuel', assignId:'chest', slots:16 },
		{ id:'solid_fuel_production', type:'production', itemId:'solid_fuel', assignId:'chemical_plant', output:1, seconds:1, inputs:[{ id:'elec', count:420 },{ id:'light_oil', count:10 }] },
		
	{ id:'lubricant', type:'item', label:'sc1_lubricant', img:'/fgfactory/sc1/lubricant.png', stack:1000, reqs:[{ id:'mission_lubricant_tech', count:50 }] },
		
		{ id:'lubricant_storage', type:'storage', itemId:'lubricant', assignId:'barrel', slots:1 },
		{ id:'lubricant_production', type:'production', itemId:'lubricant', assignId:'chemical_plant', output:10, seconds:1, inputs:[{ id:'elec', count:420 },{ id:'heavy_oil', count:10 }] },
		
	{ id:'red_pack', type:'item', label:'sc1_red_pack', img:'/fgfactory/sc1/red_pack.png', stack:200, reqs:[{ id:'mission_red_science', count:1 }] },
		
		{ id:'red_pack_storage', type:'storage', itemId:'red_pack', assignId:'chest', slots:16 },
		{ id:'red_pack_manual', type:'manual', itemId:'red_pack', counts:[ 1, 5 ], output:1, seconds:5, inputs:[{ id:'iron_plate', count:2 },{ id:'copper_plate', count:1 }] },
		{ id:'red_pack_production', type:'production', itemId:'red_pack', assignId:'lab', output:1, seconds:5, inputs:[{ id:'elec', count:5*60 },{ id:'iron_plate', count:2 },{ id:'copper_plate', count:1 }] },
		
	{ id:'green_pack', type:'item', label:'sc1_green_pack', img:'/fgfactory/sc1/green_pack.png', stack:200, reqs:[{ id:'mission_green_science', count:75 }] },
		
		{ id:'green_pack_storage', type:'storage', itemId:'green_pack', assignId:'chest', slots:16 },
		{ id:'green_pack_manual', type:'manual', itemId:'green_pack', counts:[ 1, 5 ], output:1, seconds:6, inputs:[{ id:'iron_plate', count:6 },{ id:'copper_plate', count:2 }] },
		{ id:'green_pack_production', type:'production', itemId:'green_pack', assignId:'lab', output:1, seconds:6, inputs:[{ id:'elec', count:6*60 },{ id:'iron_plate', count:6 },{ id:'copper_plate', count:2 }] },
		
	{ id:'blue_pack', type:'item', label:'sc1_blue_pack', img:'/fgfactory/sc1/blue_pack.png', stack:200, reqs:[{ id:'mission_blue_science', count:75 }] },
		
		{ id:'blue_pack_storage', type:'storage', itemId:'blue_pack', assignId:'chest', slots:16 },
		{ id:'blue_pack_manual', type:'manual', itemId:'blue_pack', counts:[ 1, 5 ], output:2, seconds:24, inputs:[{ id:'iron_plate', count:6 },{ id:'copper_plate', count:15 },{ id:'plastic', count:6 },{ id:'sulfur', count:1 },{ id:'engine_1', count:2 }] },
		{ id:'blue_pack_production', type:'production', itemId:'blue_pack', assignId:'lab', output:2, seconds:24, inputs:[{ id:'elec', count:24*60 },{ id:'iron_plate', count:6 },{ id:'copper_plate', count:15 },{ id:'plastic', count:6 },{ id:'sulfur', count:1 },{ id:'engine_1', count:2 }] },
		
	{ id:'purple_pack', type:'item', label:'sc1_purple_pack', img:'/fgfactory/sc1/purple_pack.png', stack:200, reqs:[{ id:'mission_purple_science', count:100 }] },
		
		{ id:'purple_pack_storage', type:'storage', itemId:'purple_pack', assignId:'chest', slots:16 },
		{ id:'purple_pack_manual', type:'manual', itemId:'purple_pack', counts:[ 1, 5 ], output:3, seconds:21, inputs:[{ id:'stone', count:15 },{ id:'brick', count:10 },{ id:'iron_plate', count:33 },{ id:'copper_plate', count:58 },{ id:'steel', count:25 },{ id:'plastic', count:20 }] },
		{ id:'purple_pack_production', type:'production', itemId:'purple_pack', assignId:'lab', output:3, seconds:21, inputs:[{ id:'elec', count:21*60 },{ id:'stone', count:15 },{ id:'brick', count:10 },{ id:'iron_plate', count:33 },{ id:'copper_plate', count:58 },{ id:'steel', count:25 },{ id:'plastic', count:20 }] },
		
	{ id:'yellow_pack', type:'item', label:'sc1_yellow_pack', img:'/fgfactory/sc1/yellow_pack.png', stack:200, reqs:[{ id:'mission_yellow_science', count:100 }] },
		
		{ id:'yellow_pack_storage', type:'storage', itemId:'yellow_pack', assignId:'chest', slots:16 },
		{ id:'yellow_pack_manual', type:'manual', itemId:'yellow_pack', counts:[ 1, 5 ], output:3, seconds:21, inputs:[{ id:'iron_plate', count:3 },{ id:'copper_plate', count:65 },{ id:'steel', count:7 },{ id:'plastic', count:15 },{ id:'battery', count:2 },{ id:'engine_2', count:1 },{ id:'circuit', count:2 }] },
		{ id:'yellow_pack_production', type:'production', itemId:'yellow_pack', assignId:'lab', output:3, seconds:21, inputs:[{ id:'elec', count:21*60 },{ id:'iron_plate', count:3 },{ id:'copper_plate', count:65 },{ id:'steel', count:7 },{ id:'plastic', count:15 },{ id:'battery', count:2 },{ id:'engine_2', count:1 },{ id:'circuit', count:2 }] },
	
	{ id:'engine_1', type:'item', label:'sc1_engine_1', img:'/fgfactory/sc1/engine_1.png', stack:50, reqs:[{ id:'mission_engine_1_tech', count:100 }] },
		
		{ id:'engine_1_storage', type:'storage', itemId:'engine_1', assignId:'chest', slots:16 },
		{ id:'engine_1_production', type:'production', itemId:'engine_1', assignId:'assembler_1', output:1, seconds:10, inputs:[{ id:'elec', count:750 },{ id:'iron_plate', count:4 },{ id:'steel', count:1 }] },
		
	{ id:'engine_2', type:'item', label:'sc1_engine_2', img:'/fgfactory/sc1/engine_2.png', stack:50, reqs:[{ id:'mission_engine_2_tech', count:50 }] },
		
		{ id:'engine_2_storage', type:'storage', itemId:'engine_2', assignId:'chest', slots:16 },
		{ id:'engine_2_production', type:'production', itemId:'engine_2', assignId:'assembler_2', output:1, seconds:10, inputs:[{ id:'elec', count:1500 },{ id:'iron_plate', count:2 },{ id:'copper_plate', count:3 },{ id:'engine_1', count:1 },{ id:'lubricant', count:15 }] },
		
	{ id:'concrete', type:'item', label:'sc1_concrete', img:'/fgfactory/sc1/concrete.png', stack:100, reqs:[{ id:'mission_concrete_tech', count:250 }] },
		
		{ id:'concrete_storage', type:'storage', itemId:'concrete', assignId:'chest', slots:16 },
		{ id:'concrete_production', type:'production', itemId:'concrete', assignId:'assembler_2', output:10, seconds:10, inputs:[{ id:'elec', count:1500 },{ id:'iron', count:1 },{ id:'water', count:100 },{ id:'brick', count:5 }] },
	
	{ id:'circuit', type:'item', label:'sc1_circuit', img:'/fgfactory/sc1/circuit.png', stack:100, reqs:[{ id:'mission_circuit_tech', count:300 }] },
		
		{ id:'circuit_storage', type:'storage', itemId:'circuit', assignId:'chest', slots:16 },
		{ id:'circuit_production', type:'production', itemId:'circuit', assignId:'assembler_2', output:1, seconds:10, inputs:[{ id:'elec', count:1500 },{ id:'iron_plate', count:24 },{ id:'copper_plate', count:40 },{ id:'plastic', count:4 },{ id:'acid', count:5 }] },
		
	{ id:'rocket_fuel', type:'item', label:'sc1_rocket_fuel', img:'/fgfactory/sc1/rocket_fuel.png', stack:20, reqs:[{ id:'mission_rocket_fuel_tech', count:300 }] },
		
		{ id:'rocket_fuel_storage', type:'storage', itemId:'rocket_fuel', assignId:'chest', slots:16 },
		{ id:'rocket_fuel_production', type:'production', itemId:'rocket_fuel', assignId:'assembler_2', output:1, seconds:15, inputs:[{ id:'elec', count:2250 },{ id:'iron_plate', count:24 },{ id:'light_oil', count:10 },{ id:'solid_fuel', count:10 }] },
		
	{ id:'rocket_part', type:'item', label:'sc1_rocket_part', img:'/fgfactory/sc1/rocket_part.png', stack:5, reqs:[{ id:'mission_rocket_tech', count:1000 }] },
		
		{ id:'rocket_part_storage', type:'storage', itemId:'rocket_part', assignId:'chest', slots:16 },
		{ id:'rocket_part_production', type:'production', itemId:'rocket_part', assignId:'rocket_silo', output:1, seconds:3, inputs:[{ id:'elec', count:2250 },{ id:'copper_plate', count:200 },{ id:'steel', count:20 },{ id:'plastic', count:50 },{ id:'circuit', count:10 },{ id:'rocket_fuel', count:10 }] },
	
	//////

	{ id:'chest', type:'storer', label:'sc1_chest', img:'/fgfactory/sc1/chest.png', stack:50  },
		
		{ id:'chest_manual', type:'manual', itemId:'chest', output:1, seconds:0.5, inputs:[{ id:'iron_plate', count:8 }] },
		{ id:'chest_storage', type:'storage', itemId:'chest', assignId:'chest', slots:16 },
		{ id:'chest_production', type:'production', itemId:'chest', assignId:'assembler_1', output:1, seconds:0.5, inputs:[{ id:'elec', count:37.5 },{ id:'iron_plate', count:8 }] },
		
	{ id:'tank', type:'storer', label:'sc1_tank', img:'/fgfactory/sc1/tank.png', stack:50, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'tank_manual', type:'manual', itemId:'tank', output:1, seconds:3, inputs:[{ id:'iron_plate', count:20 },{ id:'steel', count:5 }] },
		{ id:'tank_storage', type:'storage', itemId:'tank', assignId:'chest', slots:16 },
		{ id:'tank_production', type:'production', itemId:'tank', assignId:'assembler_1', output:1, seconds:3, inputs:[{ id:'elec', count:225 },{ id:'iron_plate', count:20 },{ id:'steel', count:5 }] },
		
	{ id:'accumulator', type:'storer', label:'sc1_accumulator', img:'/fgfactory/sc1/accumulator.png', stack:50, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'accumulator_manual', type:'manual', itemId:'accumulator', output:1, seconds:10, inputs:[{ id:'iron_plate', count:2 },{ id:'battery', count:5 }] },
		{ id:'accumulator_storage', type:'storage', itemId:'accumulator', assignId:'chest', slots:16 },
		{ id:'accumulator_production', type:'production', itemId:'accumulator', assignId:'assembler_1', output:1, seconds:10, inputs:[{ id:'elec', count:750 },{ id:'iron_plate', count:2 },{ id:'battery', count:5 }] },
		
	{ id:'barrel', type:'storer', label:'sc1_barrel', img:'/fgfactory/sc1/barrel.png', stack:50, reqs:[{ id:'mission_oil_tech_1', count:100 }] },
		
		{ id:'barrel_manual', type:'manual', itemId:'barrel', output:1, seconds:1, inputs:[{ id:'steel', count:1 }] },
		{ id:'barrel_storage', type:'storage', itemId:'barrel', assignId:'chest', slots:16 },
		{ id:'barrel_production', type:'production', itemId:'barrel', assignId:'assembler_1', output:1, seconds:1, inputs:[{ id:'elec', count:75 },{ id:'steel', count:1 }] },
		
	{ id:'furnace', type:'machine', label:'sc1_furnace', img:'/fgfactory/sc1/furnace.png', stack:50 },
		
		{ id:'furnace_manual', type:'manual', itemId:'furnace', output:1, seconds:0.5, inputs:[{ id:'stone', count:5 }] },
		{ id:'furnace_storage', type:'storage', itemId:'furnace', assignId:'chest', slots:16 },
		{ id:'furnace_production', type:'production', itemId:'furnace', assignId:'assembler_1', output:1, seconds:0.5, inputs:[{ id:'elec', count:0.5*75 },{ id:'stone', count:5 }] },
		
	{ id:'miner', type:'machine', label:'sc1_miner', img:'/fgfactory/sc1/miner.png', stack:50 },
		
		{ id:'miner_manual', type:'manual', itemId:'miner', output:1, seconds:4, inputs:[{ id:'stone', count:5 },{ id:'iron_plate', count:9 }] },
		{ id:'miner_storage', type:'storage', itemId:'miner', assignId:'chest', slots:16 },
		{ id:'miner_production', type:'production', itemId:'miner', assignId:'assembler_1', output:1, seconds:1, inputs:[{ id:'elec', count:300 },{ id:'stone', count:5 },{ id:'iron_plate', count:9 }] },
		
	{ id:'pump', type:'machine', label:'sc1_pump', img:'/fgfactory/sc1/pump.png', stack:20, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'pump_manual', type:'manual', itemId:'pump', output:1, seconds:3, inputs:[{ id:'iron_plate', count:7 }] },
		{ id:'pump_storage', type:'storage', itemId:'pump', assignId:'chest', slots:16 },
		{ id:'pump_production', type:'production', itemId:'pump', assignId:'assembler_1', output:1, seconds:3, inputs:[{ id:'elec', count:3*75 },{ id:'iron_plate', count:7 }] },
		
	{ id:'boiler', type:'machine', label:'sc1_boiler', img:'/fgfactory/sc1/boiler.png', stack:50, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'boiler_manual', type:'manual', itemId:'boiler', output:1, seconds:3, inputs:[{ id:'stone', count:5 },{ id:'iron_plate', count:4 }] },
		{ id:'boiler_storage', type:'storage', itemId:'boiler', assignId:'chest', slots:16 },
		{ id:'boiler_production', type:'production', itemId:'boiler', assignId:'assembler_1', output:1, seconds:3, inputs:[{ id:'elec', count:3*75 },{ id:'stone', count:5 },{ id:'iron_plate', count:4 }] },
		
	{ id:'steam_engine', type:'machine', label:'sc1_steam_engine', img:'/fgfactory/sc1/steam_engine.png', stack:10, reqs:[{ id:'mission_steam_tech', count:1 }] },
		
		{ id:'steam_engine_manual', type:'manual', itemId:'steam_engine', output:1, seconds:7, inputs:[{ id:'iron_plate', count:31 }] },
		{ id:'steam_engine_storage', type:'storage', itemId:'steam_engine', assignId:'chest', slots:16 },
		{ id:'steam_engine_production', type:'production', itemId:'steam_engine', assignId:'assembler_1', output:1, seconds:7, inputs:[{ id:'elec', count:7*75 },{ id:'iron_plate', count:31 }] },
		
	{ id:'pumpjack', type:'machine', label:'sc1_pumpjack', img:'/fgfactory/sc1/pumpjack.png', stack:20, reqs:[{ id:'mission_oil_tech_1', count:100 }] },
		
		{ id:'pumpjack_manual', type:'manual', itemId:'pumpjack', output:1, seconds:5, inputs:[{ id:'iron_plate', count:8 },{ id:'copper_plate', count:35 },{ id:'steel', count:5 }] },
		{ id:'pumpjack_storage', type:'storage', itemId:'pumpjack', assignId:'chest', slots:16 },
		{ id:'pumpjack_production', type:'production', itemId:'pumpjack', assignId:'assembler_1', output:1, seconds:5, inputs:[{ id:'elec', count:5*75 },{ id:'iron_plate', count:8 },{ id:'copper_plate', count:35 },{ id:'steel', count:5 }] },
		
	{ id:'refinery', type:'machine', label:'sc1_refinery', img:'/fgfactory/sc1/refinery.png', stack:10, reqs:[{ id:'mission_oil_tech_2', count:1 }] },
		
		{ id:'refinery_manual', type:'manual', itemId:'refinery', output:1, seconds:8, inputs:[{ id:'brick', count:10 },{ id:'iron_plate', count:40 },{ id:'copper_plate', count:15 },{ id:'steel', count:15 }] },
		{ id:'refinery_storage', type:'storage', itemId:'refinery', assignId:'chest', slots:16 },
		{ id:'refinery_production', type:'production', itemId:'refinery', assignId:'assembler_1', output:1, seconds:8, inputs:[{ id:'elec', count:8*75 },{ id:'brick', count:10 },{ id:'iron_plate', count:40 },{ id:'copper_plate', count:15 },{ id:'steel', count:15 }] },
		
	{ id:'chemical_plant', type:'machine', label:'sc1_chemical_plant', img:'/fgfactory/sc1/chemical_plant.png', stack:10, reqs:[{ id:'mission_oil_tech_2', count:1 }] },
		
		{ id:'chemical_plant_manual', type:'manual', itemId:'chemical_plant', output:1, seconds:5, inputs:[{ id:'iron_plate', count:20 },{ id:'copper_plate', count:8 },{ id:'steel', count:5 }] },
		{ id:'chemical_plant_storage', type:'storage', itemId:'chemical_plant', assignId:'chest', slots:16 },
		{ id:'chemical_plant_production', type:'production', itemId:'chemical_plant', assignId:'assembler_1', output:1, seconds:5, inputs:[{ id:'elec', count:5*75 },{ id:'iron_plate', count:20 },{ id:'copper_plate', count:8 },{ id:'steel', count:5 }] },
		
	{ id:'lab', type:'machine', label:'sc1_lab', img:'/fgfactory/sc1/lab.png', stack:10, reqs:[{ id:'mission_red_science', count:1 }] },
		
		{ id:'lab_manual', type:'manual', itemId:'lab', output:1, seconds:2, inputs:[{ id:'iron_plate', count:36 },{ id:'copper_plate', count:15 }] },
		{ id:'lab_storage', type:'storage', itemId:'lab', assignId:'chest', slots:16 },
		{ id:'lab_production', type:'production', itemId:'lab', assignId:'assembler_1', output:1, seconds:2, inputs:[{ id:'elec', count:2*75 },{ id:'iron_plate', count:36 },{ id:'copper_plate', count:15 }] },
		
	{ id:'assembler_1', type:'machine', label:'sc1_assembler_1', img:'/fgfactory/sc1/assembler_1.png', stack:50, reqs:[{ id:'mission_automation_1_tech', count:10 }] },
		
		{ id:'assembler_1_manual', type:'manual', itemId:'assembler_1', output:1, seconds:0.5, inputs:[{ id:'iron_plate', count:22 },{ id:'copper_plate', count:5 }] },
		{ id:'assembler_1_storage', type:'storage', itemId:'assembler_1', assignId:'chest', slots:16 },
		{ id:'assembler_1_production', type:'production', itemId:'assembler_1', assignId:'assembler_1', output:1, seconds:0.5, inputs:[{ id:'elec', count:0.5*75 },{ id:'iron_plate', count:22 },{ id:'copper_plate', count:5 }] },
		
	{ id:'assembler_2', type:'machine', label:'sc1_assembler_2', img:'/fgfactory/sc1/assembler_2.png', stack:50, reqs:[{ id:'mission_automation_2_tech', count:40 }] },
		
		{ id:'assembler_2_manual', type:'manual', itemId:'assembler_2', output:1, seconds:0.5, inputs:[{ id:'iron_plate', count:35 },{ id:'copper_plate', count:9 },{ id:'steel', count:2 }] },
		{ id:'assembler_2_storage', type:'storage', itemId:'assembler_2', assignId:'chest', slots:16 },
		{ id:'assembler_2_production', type:'production', itemId:'assembler_2', assignId:'assembler_1', output:1, seconds:0.5, inputs:[{ id:'elec', count:0.5*75 },{ id:'iron_plate', count:35 },{ id:'copper_plate', count:9 },{ id:'steel', count:2 }] },
		
	{ id:'rocket_silo', type:'machine', label:'sc1_rocket_silo', img:'/fgfactory/sc1/rocket_silo.png', stack:1, reqs:[{ id:'mission_rocket_tech', count:1000 }] },
		
		{ id:'rocket_silo_manual', type:'manual', itemId:'rocket_silo', output:1, seconds:30, inputs:[{ id:'iron_plate', count:100 },{ id:'steel', count:1000 },{ id:'concrete', count:1000 },{ id:'engine_2', count:200 },{ id:'circuit', count:200 }] },
		{ id:'rocket_silo_storage', type:'storage', itemId:'rocket_silo', assignId:'chest', slots:16 },
		{ id:'rocket_silo_production', type:'production', itemId:'rocket_silo', assignId:'assembler_1', output:1, seconds:30, inputs:[{ id:'elec', count:30*75 },{ id:'iron_plate', count:100 },{ id:'steel', count:1000 },{ id:'concrete', count:1000 },{ id:'engine_2', count:200 },{ id:'circuit', count:200 }] },
]
