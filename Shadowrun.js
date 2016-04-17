// Github:   
// By:       Wandler, The Apprentice
// Contact:  

var Shadowrun = Shadowrun || (function() {
    'use strict';

	var version  = '0.0.1',
	lastUpdate = 1427604268,
	tableCache = {},
	ch = function (c) {
		var entities = {
			'<' : 'lt',
			'>' : 'gt',
			"'" : '#39',
			'@' : '#64',
			'{' : '#123',
			'|' : '#124',
			'}' : '#125',
			'[' : '#91',
			']' : '#93',
			'"' : 'quot',
			'-' : 'mdash',
			' ' : 'nbsp'
		};

		if(_.has(entities,c) ){
			return ('&'+entities[c]+';');
		}
		return '';
	},
	checkInstall = function() {
        log('-=> Shadowrun v'+version+' <=-  ['+(new Date(lastUpdate*1000))+']');
	},
	showHelp = function() {
		sendChat('','/w gm The help is not implemented yet.');
	};
	
	var handleShadowrunInput = function(msg) {		
		var args;
		if (msg.type !== "api") {			
			return;
		}
		args = msg.content.splitArgs(/\s+/);
		if(args[0] == "!shadowrun"){	
			log(msg);
			var character,character_id,action;
			
			if(args.indexOf("--character") !== -1){
				character_id = args[args.indexOf("--character") + 1];
				character = getObj("character", character_id);
			}
			
			if(args.indexOf("--action") !== -1){
				action = args[args.indexOf("--action") + 1];
			}
			if(character){
				if(action == "edge-use"){
					handleEdgeUse(msg,character);
				}else if(action == "edge-refill"){
					handleEdgeRefill(msg,character);
				}else if(action == "move"){
					var distance = parseInt(args[args.indexOf("--action") + 2]);
					handleMove(msg,character,distance);
				}else if(action == "run"){
					var distance = parseInt(args[args.indexOf("--action") + 2]);					
					handleRun(msg,character,distance);
				}else if(action == "sprint"){
					var pool = parseInt(args[args.indexOf("--action") + 2]);
					handleSprint(msg,character,pool);
				}else if(action == "move-reset"){
					handleMoveReset(msg,character);
				}else if(action == "run-reset"){
					handleRunReset(msg,character);
				}else if(action == "sprint-reset"){
					handleSprintReset(msg,character);
				}else if(action == "heben"){
					handleHeben(msg,character);
				}else if(action == "tragen"){
					handleTragen(msg,character);
				}else if(action == "stemmen"){
					handleStemmen(msg,character);
				}else if(action == "heben-reset"){
					handleHebenReset(msg,character);
				}else if(action == "tragen-reset"){
					handleTragenReset(msg,character);
				}else if(action == "stemmen-reset"){
					handleStemmenReset(msg,character);
				}else if(action == "alchemy-prepare"){
					var spellname = args[args.indexOf("--spell-name") + 1];
					var force = parseInt(args[args.indexOf("--ks") + 1]);
					var basis = parseInt(args[args.indexOf("--basis") + 1]);
					var mod = parseInt(args[args.indexOf("--mod") + 1]);
					var trigger_name = args[args.indexOf("--trigger") + 1];
					var trigger = 0;
					switch(trigger_name){
						case 'Befehl':trigger=2;break;
						case 'Kontakt':trigger=1;break;
						case 'Zeitzünder':trigger=2;break;
						case 'Ver._Befehl':trigger=2;break;
						case 'Ver._Kontakt':trigger=1;break;
						case 'Ver._Kontakt_Geschlecht/Metatyp':trigger=3;break;
					}
					trigger_name = trigger_name.replace(/\_/g," ");
					handleAlchemyPrepare(msg,character,spellname,force,basis,mod,trigger,trigger_name);
				}else if(action == "alchemy-use"){
					var id = args[args.indexOf("--id") + 1];
					var wirksamkeit = parseInt(args[args.indexOf("--wirksamkeit") + 1]);
					var force = parseInt(args[args.indexOf("--force") + 1]);
					var mod = parseInt(args[args.indexOf("--mod") + 1]);
					handleAlchemyUse(msg,character,id,force,wirksamkeit);
				}else if(action == "spellcasting-cast"){
					var id = args[args.indexOf("--id") + 1];
					var spellname = args[args.indexOf("--spellname") + 1];
					var force = parseInt(args[args.indexOf("--force") + 1]);
					var basis = parseInt(args[args.indexOf("--basis") + 1]);
					var mod = parseInt(args[args.indexOf("--mod") + 1]);
					handleSpellcastingCast(msg,character,spellname,id,force,basis,mod);
				}else if(action == "summon-spirit"){
					var force = parseInt(args[args.indexOf("--force") + 1]);
					var basis = parseInt(args[args.indexOf("--basis") + 1]);
					var mod = parseInt(args[args.indexOf("--mod") + 1]);
					
					var aargs = msg.content.split(/\--+/);
					var spiritname = aargs[3].substring(12,aargs[3].length - 1);
					handleSummonSpirit(msg,character,spiritname,basis,mod,force);					
				}else if(action == "complexforms-use"){
					var id = args[args.indexOf("--id") + 1];
					var name = args[args.indexOf("--name") + 1];
					var force = parseInt(args[args.indexOf("--force") + 1]);
					var basis = parseInt(args[args.indexOf("--basis") + 1]);
					var mod = parseInt(args[args.indexOf("--mod") + 1]);
					handleComplexFormUse(msg,character,name,id,force,basis,mod);
				}else if(action == "compile-sprite"){
					var force = parseInt(args[args.indexOf("--force") + 1]);
					var basis = parseInt(args[args.indexOf("--basis") + 1]);
					var mod = parseInt(args[args.indexOf("--mod") + 1]);					
					var aargs = msg.content.split(/\--+/);
					var spritename = aargs[3].substring(12,aargs[3].length - 1);
					handleCompileSprite(msg,character,spritename,basis,mod,force);					
				}else if(action == "recoil-reset"){
					handleRecoilReset(msg,character);
				}else if(action == "physical-damage"){
					var damage = parseInt(args[args.indexOf("--value") + 1]);
					var resistpool = parseInt(args[args.indexOf("--resist") + 1]);
					physicalDamage(msg,character,damage,resistpool);
				}else if(action == "physical-healing"){
					var healingpool = parseInt(args[args.indexOf("--pool") + 1]);
					physicalHealing(msg,character,healingpool);
				}else if(action == "physical-reset"){
					physicalReset(msg,character);
				}else if(action == "mental-damage"){
					var damage = parseInt(args[args.indexOf("--value") + 1]);
					var resistpool = parseInt(args[args.indexOf("--resist") + 1]);
					mentalDamage(msg,character,damage,resistpool);
				}else if(action == "mental-healing"){
					var healingpool = parseInt(args[args.indexOf("--pool") + 1]);
					mentalHealing(msg,character,healingpool);
				}else if(action == "mental-reset"){
					mentalReset(msg,character);
				}else if(action == "overflow-damage"){
					var damage = parseInt(args[args.indexOf("--value") + 1]);
					var resistpool = parseInt(args[args.indexOf("--resist") + 1]);
					overflowDamage(msg,character,damage,resistpool);
				}else if(action == "overflow-healing"){
					var healingpool = parseInt(args[args.indexOf("--pool") + 1]);
					overflowHealing(msg,character,healingpool);
				}else if(action == "overflow-reset"){
					overflowReset(msg,character);
				}else if(action == "weaponsranged-attack"){
					var id = args[args.indexOf("--id") + 1];
					var mod = parseInt(args[args.indexOf("--mod") + 1]);					
					var bullets = parseInt(args[args.indexOf("--bullets") + 1]);
					weaponsRangedAttack(msg,character,id,mod,bullets);
				}else if(action == "weaponsranged-reload"){
					var id = args[args.indexOf("--id") + 1];
					weaponsRangedReload(msg,character,id);
				}else if(action == "order-buy"){
					var name = args[args.indexOf("--name") + 1];
					var id = args[args.indexOf("--id") + 1];
					var count = parseInt(args[args.indexOf("--count") + 1]);
					var price = parseInt(args[args.indexOf("--price") + 1]);
					var availability = parseInt(args[args.indexOf("--availability") + 1]);
					handleOrderBuy(msg,character,id,name,count,availability,price);
				}else if(action == "order-buy-roll"){
					var name = args[args.indexOf("--name") + 1];
					var id = args[args.indexOf("--id") + 1];
					var count = parseInt(args[args.indexOf("--count") + 1]);					
					var price = parseInt(args[args.indexOf("--price") + 1]);
					var availability = parseInt(args[args.indexOf("--availability") + 1]);
					var pool = undefined;
					if(args.indexOf("--pool") > -1){
						pool = parseInt(args[args.indexOf("--pool") + 1]);
					}
				
					var connection = undefined;
					if(args.indexOf("--connection") > -1){
						connection = args[args.indexOf("--connection") + 1];
					}
					
					var tryself = undefined;
					if(args.indexOf("--try-self") > -1){
						tryself = args[args.indexOf("--try-self") + 1];
						if(tryself=="True"){
							tryself = true;
						}else{
							tryself = false;
						}
					}
					handleOrderRoll(msg,character,id,name,count,availability,price,connection,tryself,pool);
				}else if(action == "contact-connection"){
					var id = args[args.indexOf("--id") + 1];
					handleContactConnection(msg,character,id);
				}else if(action == "connection-test-availability"){
					var id = args[args.indexOf("--id") + 1];
					handleConnectionTestAvailability(msg,character,id);
				}else if(action == "connection-answer-call"){
					var id = args[args.indexOf("--id") + 1];
					handleConnectionAnswerCall(msg,character,id);
				}else if(action == "fix-repeating"){
					log("Try to fix");
					var name = args[args.indexOf("--name") + 1];
					//var nameRegex = /repeating_skillsknowledge_[^_]+_skillsknowledge_id/;
					var nameRegex = new RegExp('repeating_'+name+'_[^_]*_'+name+'.*');
					var searchResult = filterObjs(function(o){return o.get('type')==='attribute' && o.get('characterid') === character.id && o.get('name').match(nameRegex);});
					log(searchResult);
					_.each(searchResult,function(r){					
						log(r);
					});
				}
			}else{
				log("no character");
				log(msg);
				if(action == "extended-test"){
					args = msg.content.splitArgs();
					log(args);
					var pool = undefined;
					if(args.indexOf("--pool")>-1){pool = parseInt(args[args.indexOf("--pool") + 1]);}
					var target = undefined;
					if(args.indexOf("--target")>-1){target = parseInt(args[args.indexOf("--target") + 1]);}
					var intervall = undefined;
					if(args.indexOf("--intervall")>-1){intervall = args[args.indexOf("--intervall") + 1];}
					var id = undefined;
					if(args.indexOf("--id")){id = args[args.indexOf("--id") + 1];}
					log(intervall);
					handleExtendedTest(msg,pool,target,intervall,id);					
				}else if(action == "extended-test-reset"){
					var extendedTests = state.Shadowrun["extendedTests"];
					for(var e in extendedTests){
						log(extendedTests[e]);
						delete extendedTests[e];
						
					}
				}else if(action == "extended-test-menu"){
					var id = undefined;
					if(args.indexOf("--id")){id = args[args.indexOf("--id") + 1];}
					handleExtendedTestMenu(msg,id);
				}else if(action == "extended-test-rename"){
					log(msg);
					log(action);
					var id = undefined;
					if(args.indexOf("--id")){id = args[args.indexOf("--id") + 1];}
					var name = undefined;
					if(args.indexOf("--name")){name = args[args.indexOf("--name") + 1];}
					handleExtendedTestRename(msg,id,name);
				}else if(action == "extended-test-delete"){
					var id = undefined;
					if(args.indexOf("--id")){id = args[args.indexOf("--id") + 1];}
					handleExtendedTestDelete(msg,id);
				}				
			}
		}
	};
	
	var handleRecoilReset = function (msg,character){
		var recoil = attributes.get(character,"recoil");
		attributes.set(recoil,0);
		whisperToGM(msg.who,msg.who,"Rückstoß zurückgesetzt");
	};
	
	var messageConditionMonitor = function(msg,character,probe){
		var zmg_aktuell = attributes.get(character,"zmg_aktuell");
		var zmg_maximum = attributes.get(character,"zmg_maximum");
		var zmg_toleranz = attributes.get(character,"zmg_toleranz");
	
		var zmp_aktuell = attributes.get(character,"zmp_aktuell");
		var zmp_maximum = attributes.get(character,"zmp_maximum");
		var zmp_toleranz = attributes.get(character,"zmp_toleranz");
	
		var overflow_aktuell = attributes.get(character,"overflow_aktuell");
		var overflow_maximum  = attributes.get(character,"overflow_maximum");
		var overflow_toleranz = attributes.get(character,"overflow_toleranz");			
	
		var injury_mod = attributes.get(character,"injury_mod");
		var ic = attributes.I(injury_mod);
				
		var pc = attributes.I(zmp_aktuell);
		var pm = attributes.I(zmp_maximum);
		var pt = attributes.I(zmp_toleranz);
	
		var gc = attributes.I(zmg_aktuell);
		var gm = attributes.I(zmg_maximum);
		var gt = attributes.I(zmg_toleranz);
	
		var oc = attributes.I(overflow_aktuell);
		var om = attributes.I(overflow_maximum);
		var ot = attributes.I(overflow_toleranz);		

		var rt = '&{template:zustandsmonitor}{{paktuell='+pc+'}}{{pmax='+pm+'}}{{gaktuell='+gc+'}}{{gmax='+gm+'}}{{overflow='+oc+'}}{{overflowmax='+om+'}}{{mod='+ic+'}}';
		if(probe != undefined){
			rt +='{{probe='+probe+'}}';
		}
		whisperTo(msg.who,"gm",rt);
	}
	
	var physicalDamage = function (msg,character,damage,resistpool){
		var zmp_aktuell = attributes.get(character,"zmp_aktuell");
		var p = attributes.I(zmp_aktuell);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			
			var unresistedDamage = Math.max(0,damage-s);
			var pnew = p + unresistedDamage;
			attributes.set(zmp_aktuell,pnew);
			updateConditionMonitorAndInjury(character);
			messageConditionMonitor(msg,character,damage+"P-"+roll+"="+pnew);
		};
		sendChat(msg.who, "/roll [["+resistpool+"d6sacs5cs6>5]]", process);
	};
		
	var physicalHealing = function (msg,character,healingpool){
		var zmp_aktuell = attributes.get(character,"zmp_aktuell");
		var p = attributes.I(zmp_aktuell);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			
			var pnew = Math.max(0,p-s);
			attributes.set(zmp_aktuell,pnew);
			updateConditionMonitorAndInjury(character);
			messageConditionMonitor(msg,character,"Heilt "+s+"P Schaden");
		};
		sendChat(msg.who, "/roll [["+healingpool+"d6sacs5cs6>5]]", process);
	};
	
	var physicalReset = function (msg,character){
		var zmp_aktuell = attributes.get(character,"zmp_aktuell");
		attributes.set(zmp_aktuell,0);
		updateConditionMonitorAndInjury(character);
		messageConditionMonitor(msg,character,"Physisch -> 0");
	};
	
	var mentalDamage = function (msg,character,damage,resistpool){
		var zmg_aktuell = attributes.get(character,"zmg_aktuell");
		var g = attributes.I(zmg_aktuell);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			
			var unresistedDamage = Math.max(0,damage-s);
			var gnew = g + unresistedDamage;
			attributes.set(zmg_aktuell,gnew);
			updateConditionMonitorAndInjury(character);
			messageConditionMonitor(msg,character,damage+"G-"+roll+"="+gnew);

		};
		sendChat(msg.who, "/roll [["+resistpool+"d6sacs5cs6>5]]", process);
	};
		
	var mentalHealing = function (msg,character,healingpool){
		var zmg_aktuell = attributes.get(character,"zmg_aktuell");
		var g = attributes.I(zmg_aktuell);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			
			var gnew = Math.max(0,g-s);
			attributes.set(zmp_aktuell,pnew);
			updateConditionMonitorAndInjury(character);
			messageConditionMonitor(msg,character,"Heilt "+s+"G Schaden");
		};
		sendChat(msg.who, "/roll [["+healingpool+"d6sacs5cs6>5]]", process);
	};
	
	var mentalReset = function (msg,character){
		var zmg_aktuell = attributes.get(character,"zmg_aktuell");
		attributes.set(zmg_aktuell,0);
		updateConditionMonitorAndInjury(character);
		messageConditionMonitor(msg,character,"Geistig -> 0");
	};
	
	var overflowDamage = function (msg,character,damage,resistpool){
		var overflow_aktuell = attributes.get(character,"overflow_aktuell");
		var o = attributes.I(overflow_aktuell);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			
			var unresistedDamage = Math.max(0,damage-s);
			var onew = o + unresistedDamage;
			attributes.set(overflow_aktuell,onew);
			updateConditionMonitorAndInjury(character);
			messageConditionMonitor(msg,character,damage+"Überzählig-"+roll+"="+onew);

		};
		sendChat(msg.who, "/roll [["+resistpool+"d6sacs5cs6>5]]", process);
	};
		
	var overflowHealing = function (msg,character,healingpool){
		var overflow_aktuell = attributes.get(character,"overflow_aktuell");
		var o = attributes.I(overflow_aktuell);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			
			var onew = Math.max(0,o-s);
			attributes.set(overflow_aktuell,onew);
			updateConditionMonitorAndInjury(character);
			messageConditionMonitor(msg,character,"Heilt "+s+" überzähligen Schaden");
		};
		sendChat(msg.who, "/roll [["+healingpool+"d6sacs5cs6>5]]", process);
	};
	
	var overflowReset = function (msg,character){
		var overflow_aktuell = attributes.get(character,"overflow_aktuell");
		attributes.set(overflow_aktuell,0);
		updateConditionMonitorAndInjury(character);
		messageConditionMonitor(msg,character,"Überzählig -> 0");
	};
	
	var weaponsRangedReload = function(msg,character,id){
		var weapon_name = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_name"));
		var weapon_pool = attributes.I(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged"));
		var weapon_tarn = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_tarn"));
		var weapon_short = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_short"));
		var weapon_medium = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_medium"));
		var weapon_long = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_long"));
		var weapon_extreme = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_extreme"));
		var weapon_dv = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_dv"));
		var weapon_precision = attributes.I(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_precision"));
		var weapon_dk = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_dk"));
		var weapon_rk = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_rk"));
		var weapon_mod = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_mod"));
		var weapon_amm_current = attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_ammunition_current");
		var ac = attributes.I(weapon_amm_current);
		var weapon_amm_max = attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_ammunition_maximum");
		var am = attributes.I(weapon_amm_max);
		
		attributes.set(weapon_amm_current,am);
		
		var weapon_amm_mag = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_magazin"));		
		whisperToGM(msg.who,msg.who,weapon_name+" mit "+am+" Schuss Munition ("+weapon_amm_mag+") geladen");
		
	};
	
	var weaponsRangedAttack = function(msg,character,id,mod,bullets){
		var weapon_name = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_name"));
		var weapon_pool = attributes.I(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged"));
		var weapon_tarn = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_tarn"));
		var weapon_short = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_short"));
		var weapon_medium = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_medium"));
		var weapon_long = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_long"));
		var weapon_extreme = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_extreme"));
		var weapon_dv = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_dv"));
		var weapon_precision = attributes.I(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_precision"));
		var weapon_dk = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_dk"));
		var weapon_rk = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_rk"));
		var weapon_mod = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_mod"));
		var weapon_amm_current = attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_ammunition_current");
		var ac = attributes.I(weapon_amm_current);
		
		if(bullets>ac){
			whisperToGM(msg.who,msg.who,"Ungenügend Munition geladen "+bullets+"/"+ac);
			bullets = Math.min(bullets,ac);			
		}
		attributes.set(weapon_amm_current,Math.max(0,ac-bullets));
		
		var recoil = attributes.get(character,"recoil");
		var r = attributes.I(recoil);
		attributes.set(recoil,r+bullets);
		
		var weapon_amm_max = attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_ammunition_maximum");
		var am = attributes.I(weapon_amm_max);
		var weapon_amm_mag = attributes.S(attributes.get(character,"repeating_weaponsranged_"+id+"_weaponsranged_magazin"));		
		
		var dicepool = Math.max(weapon_pool + mod,0);
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
						
			whisperToGM(msg.who,msg.who,'&{template:rangedattack}{{text=feuert '+weapon_name+' ab}}{{basis='+weapon_pool+'}}{{mod='+mod+'}}{{pool='+dicepool+'}}{{erfolge='+roll+'}}'+
			'{{kurz='+weapon_short+'}}'+'{{mittel='+weapon_medium+'}}'+'{{weit='+weapon_long+'}}'+'{{extrem='+weapon_extreme+'}}'+
			'{{schaden='+weapon_dv+'}}'+'{{dk='+weapon_dk+'}}'+'{{rk='+weapon_rk+'}}'+
			'{{modus='+weapon_mod+'}}'+'{{praezision='+weapon_precision+'}}'+'{{munition_aktuell='+ac+'}}'+'{{munition_maximum='+am+'}}'+
			'{{tarn='+weapon_tarn+'}}{{anzahlkugeln='+bullets+'}}');
		};
		sendChat(msg.who, "/roll [["+dicepool+"d6sacs5cs6>5kh"+weapon_precision+"]]", process);
		
	};
	
	var handleExtendedTestMenu = function(msg,id) {		
		var extendedTests = state.Shadowrun["extendedTests"];		
		if(msg.playerid in extendedTests){
			/* Player does have tests */
			var etp = extendedTests[msg.playerid];
			if(!(id in etp)){
				whisperToGM(msg.who,msg.who,"This Extended Test does not exist anymore");
				return;
			}
			var test = etp[id];
			var outputText='<div class="sheet-rolltemplate-script extended-test"><table><tr class="header"><td class="who">'+msg.who+'</td><td class="what">Ausgedehnte Proben</td></tr>';
			outputText +='<tr class="extended-test-roll">';
			outputText +='<td class="extended-test-number"><a href="!shadowrun --action extended-test-rename --id '+test.id+' --name &quot;?{Name}&quot;">Umbenennen</a></td>';
			outputText +='<td class="extended-test-successes"><a href="!shadowrun --action extended-test-delete --id '+test.id+'">Löschen</a></td>';
			outputText +='</tr>';
			outputText +='</div>';
			whisperToGM(msg.who,msg.who,outputText);
		}
	};
	
	var handleExtendedTestRename = function(msg,id,name) {
		var extendedTests = state.Shadowrun["extendedTests"];
		if(msg.playerid in extendedTests){
			/* Player does have tests */
			if(!(msg.playerid in extendedTests)){
				whisperToGM(msg.who,msg.who,"This Player has no active Extended Tests");
				return;
			}
			var etp = extendedTests[msg.playerid];
			log(etp);
			log("ID IS ");
			log(id);
			
			if(!(id in etp)){
				whisperToGM(msg.who,msg.who,"This Extended Test does not exist anymore");
				return;
			}
			var test = etp[id];
			log(test);
			test["name"] = name;
			var outputText = "Test "+test.pool+"W6("+test.target+","+test.intervall+") für "+msg.who+" umbenannt in "+name;
			whisperToGM(msg.who,msg.who,outputText);
		}
	};
	
	var handleExtendedTestDelete = function(msg,id) {		
		var extendedTests = state.Shadowrun["extendedTests"];		
		if(msg.playerid in extendedTests){
			/* Player does have tests */
			if(!(msg.playerid in extendedTests)){
				whisperToGM(msg.who,msg.who,"This Extended Test does not exist anymore");
				return;
			}
			var etp = extendedTests[msg.playerid];
			if(!(id in etp)){
				whisperToGM(msg.who,msg.who,"This Extended Test does not exist anymore");
				return;
			}
			var test = etp[id];
			var outputText = "Test "+test.pool+"W6("+test.target+","+test.intervall+") für "+msg.who+" gelöscht";
			whisperToGM(msg.who,msg.who,outputText);
			delete etp[id];
		}
	};
	
	var handleExtendedTest = function(msg,p,t,intervall,id) {
		if(p == undefined || t == undefined || intervall == undefined){
			log(p);
			log(t);
			log(intervall);
			//  The player has just called extendedTest but did not provide a pool or anything. List all active extendedTest by the player.
			var outputText='<div class="sheet-rolltemplate-script extended-test"><table><tr class="header"><td class="who">'+msg.who+'</td><td class="what">Ausgedehnte Proben</td></tr>';
			var extendedTests = state.Shadowrun["extendedTests"];		
			log("ExtendedTests IS:");
			log(extendedTests);			
			if(msg.playerid in extendedTests){
				log("List the player which tests he already started")
				//  The player already has started some extendedTests earlier, list them first
				
				if(!(msg.playerid in extendedTests)){
					whisperToGM(msg.who,msg.who,"This Extended Test does not exist anymore");
					return;
				}
				
				var etp = extendedTests[msg.playerid];
				log("ETP IS:")
				log(etp);
				var i = 0;
				for(var key in etp){
					i++;
					var test = etp[key];
					log("Test "+i);
					log(test);
					var label;
					if("name" in test){
						label = '<a href="!shadowrun --action extended-test-menu --id '+test.id+'">'+test.name+'</a>';
					}else{
						label = '<a href="!shadowrun --action extended-test-menu --id '+test.id+'">Test '+i+'</a>';
					}
					outputText +='<tr class="extended-test-roll">';
					outputText +='<td class="extended-test-number">'+label+'</td>';
					outputText +='<td class="extended-test-successes"><a href="!shadowrun --action extended-test --pool '+test.pool+' --target '+test.target+' --intervall &quot;'+test.intervall+'&quot; --id '+test.id+'">'+test.pool+'W6('+test.target+','+test.intervall+')</a></td>';
					outputText +='</tr>';	
				}
			}
			outputText +='<tr class="extended-test-roll">';
			outputText +='<td class="extended-test-number">Ausgedehnte Probe</td>';
			outputText +='<td class="extended-test-successes"><a href="!shadowrun --action extended-test --pool ?{Pool|0} --target ?{Benötigte Erfolge?|0}  --intervall &quot;?{Intervall?|1 Kampfrunde|1 Minute|10 Minuten|30 Minuten|1 Stunde|1 Tag|1 Woche|1 Monat}&quot; --id new">Neue Probe</a></td>';
			outputText +='</tr>';
			
			// Close outputText
			outputText += "</div>";
			whisperToGM(msg.who,msg.who,outputText);
			return;
		}
				
		if(id != undefined){
			/* We want to roll "roll-by-roll" */
			var extendedTests = state.Shadowrun["extendedTests"];
			var etp;
			if(msg.playerid in extendedTests){
				log("Load existing Tests by player");
				etp = extendedTests[msg.playerid];
			}else{
				log("Create new tests for player");
				etp = {};
				extendedTests[msg.playerid] = etp;
			}
			var test = undefined;
			log("ETP IS:");
			log(etp);	
			if(id in etp){
				test = etp[id];
			}else{
				id = generateRowID();
				var rolls = [];
				test = {id:id,intervall:intervall,pool:p,target:t,rolls:rolls};
				etp[id] = test;
			}
			var outputText='<div class="sheet-rolltemplate-script extended-test"><table><tr class="header"><td class="name"><a href="!shadowrun --action extended-test-rename --id '+id+' --name &quot;?{Name}&quot;">'+(test.name==undefined?msg.who:test.name)+'</a></td><td class="what">'+p+'W6('+t+','+intervall+')</td></tr>';
			var intervall = intervall;
			var pool = p;
			var target = t;
			var process = function(x) {
				var RollValue = x[0].inlinerolls[0];
				var roll = buildInline(RollValue, undefined, undefined);
				var s = parseInt(RollValue["results"]["total"]);
				
				var totalSucccesses = s;
				/* Old rolls */
				var i=0;
				for(i=0; i < test.rolls.length; i++){
					var rollI = test.rolls[i];
					totalSucccesses += rollI.successes;
					
					outputText +='<tr class="extended-test-roll">';
					outputText +='<td class="extended-test-number">'+rollI.rollnumber+':'+rollI.pool+'W6</td>';
					outputText +='<td class="extended-test-successes">'+rollI.roll+'</td>';
					outputText +='</tr>';	
				}

				var currentRoll = {who:msg.who,rollnumber:test.rolls.length,successes:s,pool:pool,target:target,intervall:intervall,roll:roll};
				test.rolls[test.rolls.length] = currentRoll;
					
				/* Current roll */				
				outputText +='<tr class="extended-test-roll">';
				outputText +='<td class="extended-test-number">'+currentRoll.rollnumber+':'+currentRoll.pool+'W6</td>';
				outputText +='<td class="extended-test-successes">'+currentRoll.roll+'</td>';
				outputText +='</tr>';
				
				/* Next roll or sum */					
				if(totalSucccesses < target){			
					pool -= 1;									
					if(pool>0){
						outputText +='<tr class="extended-test-roll">';
						outputText +='<td class="extended-test-number"><a href="!shadowrun --action extended-test --pool '+pool+' --target '+target+' --intervall &quot;'+intervall+'&quot; --id '+id+'">'+(test.rolls.length)+':'+pool+'W6</a></td>';
						outputText +='<td class="extended-test-successes">'+totalSucccesses+'+?</td>';
						outputText +='</tr>';
						whisperToGM(msg.who,msg.who,outputText);
					}else{
						//Test Fehlgeschlagen
						outputText +='<tr class="extended-test-roll">';
						outputText +='<td class="extended-test-number">Fehlschlag</td>';
						outputText +='<td class="extended-test-successes">'+totalSucccesses+'</td>';
						outputText +='</tr>';
						/*extended-test*/
						outputText +='</table></div>';
						whisperToGM(msg.who,msg.who,outputText);
						delete etp[id];
					}
				}else{
					//Test Erfolgreich
					outputText +='<tr class="extended-test-roll userscript-final">';
					outputText +='<td class="extended-test-number">Erfolgreich</td>';
					outputText +='<td class="extended-test-successes">'+totalSucccesses+'</td>';
					outputText +='</tr>';
					/*extended-test*/
					outputText +='</table></div>';
					whisperToGM(msg.who,msg.who,outputText);
					delete etp[id];
				}
			};
			sendChat(msg.who, "/roll [["+pool+"d6sacs5cs6>5]]", process);
			
		}else{
			/* We want to roll "all-at-once" */
			var rollnumber =0;
			var pool = p;
			var successes = 0;
			var target = t;
			
			var process = function(x) {
				var RollValue = x[0].inlinerolls[0];
				var roll = buildInline(RollValue, undefined, undefined);
				var s = parseInt(RollValue["results"]["total"]);
				rollnumber += 1;
				successes += s;
							
				outputText +='<tr class="extended-test-roll">';
				outputText +='<td class="extended-test-number">'+rollnumber+':'+pool+'W6</td>';
				outputText +='<td class="extended-test-successes">'+roll+'</td>';
				outputText +='</tr>';
	
				if(successes<target){
					pool-=1;
					if(pool>0){
						sendChat(msg.who, "/roll [["+pool+"d6sacs5cs6>5]]", process);	
					}else{
						//Test Fehlgeschlagen
						outputText +='<tr class="extended-test-roll">';
						outputText +='<td class="extended-test-number">Fehlschlag</td>';
						outputText +='<td class="extended-test-successes">'+successes+'</td>';
						outputText +='</tr>';
						/*extended-test*/
						outputText +='</table></div>';
						whisperToGM(msg.who,msg.who,outputText);
					}
				}else{
					//Test Erfolgreich
					outputText +='<tr class="extended-test-roll userscript-final">';
					outputText +='<td class="extended-test-number">Erfolgreich</td>';
					outputText +='<td class="extended-test-successes">'+successes+'</td>';
					outputText +='</tr>';
					/*extended-test*/
					outputText +='</table></div>';
					whisperToGM(msg.who,msg.who,outputText);
				}
			};
			sendChat(msg.who, "/roll [["+pool+"d6sacs5cs6>5]]", process);
		}			
	};
		
	var handleToken = function(token) {
		if( 'graphic' === token.get('type') && 'token'   === token.get('subtype')) {
			handleLinkedBars(token);
		}		
	};	
	
	var handleMove = function(msg,character,distance){	
		var available_move = attributes.get(character,"bewegung_gehen");
		var available_run = attributes.get(character,"bewegung_laufen");
		var avdm = attributes.I(available_move);
		var avdr = attributes.I(available_run);
		
		if(avdm < distance){
			if(avdr < distance){
				whisperToGM(msg.who,msg.who,"Du kannst dich nicht so weit bewegen. Du musst sprinten.");
						
			}else{
				whisperToGM(msg.who,msg.who,"Du musst laufen");
				attributes.set(available_move,0);
				attributes.set(available_run,avdr-distance);
			}
		}else{
			attributes.set(available_move,avdm-distance);
			attributes.set(available_run,avdr-distance);
		}
	};
	
	var handleRun = function(msg,character,distance){
		log(character);
		log(distance);
		var available_move = attributes.get(character,"bewegung_gehen");
		log(available_move);
		var available_run = attributes.get(character,"bewegung_laufen");
		log(available_run);
		var avdm = attributes.I(available_move);
		log(avdm);
		var avdr = attributes.I(available_run);
		log(avdr);
		
		if(avdm < distance){
			if(avdr < distance){
				whisperToGM(msg.who,msg.who,"Du kannst dich nicht so weit bewegen. Du musst sprinten.");				
			}else{
				whisperToGM(msg.who,msg.who,"Du läufst");
				
				attributes.set(available_move,0);
				attributes.set(available_run,avdr-distance);
			}
		}else{
			attributes.set(available_move,avdm-distance);
			attributes.set(available_run,avdr-distance);
		}
	};
	
	var handleSprint = function(msg,character,pool){				
		var sprinten_mod = attributes.get(character,"bewegung_sprinten_mod");
		var sprinten_distanz = attributes.get(character,"bewegung_sprinten");
		var bewegung_laufen = attributes.get(character,"bewegung_laufen");
		var sm = attributes.I(sprinten_mod);
		var bl = attributes.I(bewegung_laufen);

		var use_edge = attributes.get(character,"use_edge");
		var edge = attributes.get(character,"edg");
		var edg = attributes.I(edge);
		var use_injury_mod = attributes.get(character,"use_injury_mod");
		var injury_mod = attributes.get(character,"injury_mod");
		var injury_modi = -attributes.I(injury_mod);
		var edgetoken = (attributes.S(use_edge)=="on")?"!":"";
		var edgetext = (attributes.S(use_edge)=="on")?"{{edge=Edge "+edg+"}}":"";
		var edgemod = (attributes.S(use_edge)=="on")?edg:0;
		var injurytext = (attributes.S(use_injury_mod)=="on")?"{{injurymod=-"+injury_modi+"}}":"";
		var injurymod = (attributes.S(use_injury_mod)=="on")?injury_modi:0;
		pool = pool + injurymod + edgemod;
		if(pool > 0){
			sendChat(character.get('name'), "/roll [["+pool+"d6"+edgetoken+"sacs5cs6>5]]", function(x) {
				var RollValue = 0;
				var i = 1;
				Object.keys(x[0].inlinerolls).forEach(function(i) {
					RollValue = x[0].inlinerolls[i];
					var roll = buildInline(RollValue, undefined, undefined);
					var s = parseInt(RollValue["results"]["total"]);
					var bonus = s*sm;
					attributes.set(sprinten_distanz,bonus);
					attributes.set(bewegung_laufen,bl+bonus);
					whisperToGM(msg.who,msg.who,"&{template:roll}{{erfolge="+roll+"}}{{text=Sprinten}}{{total="+pool+"}}"+edgetext+injurytext+"{{desc=<div style=\"text-align:center;\">+"+bonus+"m</div>}}");
				});
			});
		}else{
			whisperToGM(msg.who,msg.who,"Nicht genug Würfel! "+pool);			
		}		
	};
	
	var handleMoveReset = function(msg,character){
		log(character);
		var available_move = attributes.get(character,"bewegung_gehen");
		var available_run = attributes.get(character,"bewegung_laufen");
		var available_move_mult = attributes.get(character,"bewegung_gehen_mult");
		var available_run_mult = attributes.get(character,"bewegung_laufen_mult");
		var sprinten_distanz = attributes.get(character,"bewegung_sprinten");
		var ges = attributes.get(character,"ges");
		var g = attributes.I(ges);
		var mm = attributes.F(available_move_mult);
		var rm = attributes.F(available_run_mult);
		attributes.set(available_move,g*mm);
		attributes.set(available_run,g*rm);
		attributes.set(sprinten_distanz,0);
	};
	
	var handleRunReset = function(msg,character){
		handleMoveReset(msg,character);
	};
	
	var handleSprintReset = function(msg,character){
		handleMoveReset(msg,character);
	};
	
	var handleEdgeUse = function(msg,character){
		var edge_current = attributes.get(character,"edgepunkte_aktuell");
		var current = attributes.I(edge_current);
		
		if (current == 0){
			whisperToGM(msg.who,msg.who,"Nicht genügend Edgepunkte!");			
		}else{
			attributes.set(edge_current,current - 1)
		}
	};
	
	var handleHebenReset = function(msg,character){
		var str = attributes.get(character,"str");
		var kon = attributes.get(character,"kon");
		var heben = attributes.get(character,"tragkraft_heben");
		var tragen = attributes.get(character,"tragkraft_tragen");
		var stemmen = attributes.get(character,"tragkraft_stemmen");
		var heben_mult = attributes.get(character,"tragkraft_heben_mult");
		var tragen_mult = attributes.get(character,"tragkraft_tragen_mult");
		var stemmen_mult = attributes.get(character,"tragkraft_stemmen_mult");
		var h = attributes.I(heben);
		var t = attributes.I(tragen);
		var s = attributes.I(stemmen);
		var hm = attributes.I(heben_mult);
		var tm = attributes.I(tragen_mult);
		var sm = attributes.I(stemmen_mult);
		var stri = attributes.I(str);
		var koni = attributes.I(kon);
		attributes.set(heben,stri*15);
		attributes.set(tragen,stri*10);
		attributes.set(stemmen,stri*5);
	};
	
	var handleTragenReset = function(msg,character){
		handleHebenReset(msg,character);
	};
	
	var handleStemmenReset = function(msg,character){
		handleHebenReset(msg,character);
	};
	
	var handleHeben = function(msg,character){
		var str = attributes.get(character,"str");
		var kon = attributes.get(character,"kon");
		var heben = attributes.get(character,"tragkraft_heben");
		var tragen = attributes.get(character,"tragkraft_tragen");
		var stemmen = attributes.get(character,"tragkraft_stemmen");
		var heben_mult = attributes.get(character,"tragkraft_heben_mult");
		var tragen_mult = attributes.get(character,"tragkraft_tragen_mult");
		var stemmen_mult = attributes.get(character,"tragkraft_stemmen_mult");
		var h = attributes.I(heben);
		var t = attributes.I(tragen);
		var s = attributes.I(stemmen);
		var hm = attributes.I(heben_mult);
		var tm = attributes.I(tragen_mult);
		var sm = attributes.I(stemmen_mult);
		var stri = attributes.I(str);
		var koni = attributes.I(kon);
		var pool = stri+koni;
		
		var use_edge = attributes.get(character,"use_edge");
		var edge = attributes.get(character,"edg");
		var edg = attributes.I(edge);
		var use_injury_mod = attributes.get(character,"use_injury_mod");
		var injury_mod = attributes.get(character,"injury_mod");
		var injury_modi = -attributes.I(injury_mod);
		var edgetoken = (attributes.S(use_edge)=="on")?"!":"";
		var edgetext = (attributes.S(use_edge)=="on")?"{{edge=Edge "+edg+"}}":"";
		var edgemod = (attributes.S(use_edge)=="on")?edg:0;
		var injurytext = (attributes.S(use_injury_mod)=="on")?"{{injurymod=-"+injury_modi+"}}":"";
		var injurymod = (attributes.S(use_injury_mod)=="on")?injury_modi:0;
		pool = pool + injurymod + edgemod;
		
		if(pool > 0 ){
			sendChat(character.get('name'), "/roll [[("+pool+")d6sacs5cs6>5]]", function(x) {
				var RollValue = 0;
				var i = 1;
				Object.keys(x[0].inlinerolls).forEach(function(i) {
					RollValue = x[0].inlinerolls[i];
					var roll = buildInline(RollValue, undefined, undefined);
					var s = parseInt(RollValue["results"]["total"]);
					heben.set('current',(stri+s)*15);
					tragen.set('current',(stri+s)*10);
					stemmen.set('current',(stri+s)*5);					
					whisperToGM(msg.who,msg.who,"&{template:roll}{{erfolge="+roll+"}}{{text=Heben & Tragen}}{{total="+pool+"}}"+edgetext+injurytext+"{{desc=<div style=\"text-align:center;\">+"+(s*15)+"kg/"+(s*10)+"kg/"+(s*5)+"kg</div>}}");
				});
			});
		}else{
			whisperToGM(msg.who,msg.who,"Nicht genug Würfel! "+pool);
		}
		
	};
	
	var handleTragen = function(msg,character){
		handleHeben(msg,character);
	};
	
	var handleStemmen = function(msg,character){
		handleHeben(msg,character);
	};
	
	var handleEdgeRefill = function(msg,character){
		var edge_total = attributes.get(character,"edg");
		var edge_current = attributes.get(character,"edgepunkte_aktuell");
		var edge_total = attributes.I(edge_total);
		attributes.set(edge_current,edge_total);
	};
	var handleConnectionTestAvailability = function(msg,character,id){
		var connection_name = attributes.S(attributes.get(character,"repeating_connections_"+id+"_connections_name"));
		var connection_loyality = attributes.I(attributes.get(character,"repeating_connections_"+id+"_connections_loyality"));
		var connection_rating = attributes.I(attributes.get(character,"repeating_connections_"+id+"_connections_rating"));
		
		var process = function(x) {
			var RollValue = x[0].inlinerolls[0];
			var roll = buildInline(RollValue, undefined, undefined);
			var s = parseInt(RollValue["results"]["total"]);
			if(s>=connection_rating){
				var rt = '<div class="sheet-rolltemplate-roll">'+
					'<table class="sheet-box sheet-cyan">'+
					'<tr>'+	
					'<td class="sheet-text">'+
					'<div class="sheet-desc">'+connection_name+'(L:'+connection_loyality+',E:'+connection_rating+'<='+roll+')</div>'+
					'</td>'+
					'</tr>'+
					'<tr>'+
					'<td class="border-top" colspan="2"><div class="sheet-note">Hallo, Was gibt es?'+
					'</div></td>'+
					'</tr>'+
					'</table>'+
					'</div>';
				whisperTo(connection_name,msg.who,rt);
			}else{
				var rt = '<div class="sheet-rolltemplate-roll">'+
					'<table class="sheet-box sheet-cyan">'+
					'<tr>'+	
					'<td class="sheet-text">'+
					'<div class="sheet-desc">'+connection_name+'(L:'+connection_loyality+',E:'+connection_rating+'>'+roll+')</div>'+
					'</td>'+
					'</tr>'+
					'<tr>'+
					'<td class="border-top" colspan="2"><div class="sheet-note">... es hebt niemand ab...'+
					'</div></td>'+
					'</tr>'+
					'</table>'+
					'</div>';
				whisperTo(connection_name,msg.who,rt);
			}
			
		};
		sendChat(msg.who, "/roll [[2d6sacs5cs6]]", process);
	};
	var handleConnectionAnswerCall = function(msg,character,id){
		log(character);
		log(id);
		var connection_name = attributes.S(attributes.get(character,"repeating_connections_"+id+"_connections_name"));
		var connection_loyality = attributes.I(attributes.get(character,"repeating_connections_"+id+"_connections_loyality"));
		var connection_rating = attributes.I(attributes.get(character,"repeating_connections_"+id+"_connections_rating"));
		var rt = '<div class="sheet-rolltemplate-roll">'+
			'<table class="sheet-box sheet-cyan">'+
			'<tr>'+	
			'<td class="sheet-text">'+
			'<div class="sheet-desc">'+connection_name+'(L:'+connection_loyality+',E:'+connection_rating+')</div>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td class="border-top" colspan="2"><div class="sheet-note">Hallo, Was gibt es?'+
			'</div></td>'+
			'</tr>'+
			'</table>'+
			'</div>';
			whisperTo(connection_name,msg.who,rt);

	};
	var handleContactConnection = function(msg,character,id){
		log(id);
		var connection_name = attributes.S(attributes.get(character,"repeating_connections_"+id+"_connections_name"));
		var connection_loyality = attributes.I(attributes.get(character,"repeating_connections_"+id+"_connections_loyality"));
		var connection_rating = attributes.I(attributes.get(character,"repeating_connections_"+id+"_connections_rating"));
		var rt = '<div class="sheet-rolltemplate-roll">'+
			'<table class="sheet-box sheet-cyan">'+
			'<tr>'+	
			'<td class="sheet-text">'+
			'<div class="sheet-desc">'+msg.who+' möchte '+connection_name+'(L:'+connection_loyality+',E:'+connection_rating+') kontaktieren</div>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td class="border-top" colspan="2"><div class="sheet-note">'+
			'<a href="!shadowrun --character '+character.id+' --action connection-test-availability --id '+id+' --name '+connection_name+' --loyality '+connection_loyality+' --rating '+connection_rating+'">2W6 ob verfügbar</a><br/>'+
			'<a href="!shadowrun --character '+character.id+' --action connection-answer-call --id '+id+' --name '+connection_name +' --loyality '+connection_loyality+' --rating '+connection_rating+'">Abheben</a><br/>'+
			'</div></td>'+
			'</tr>'+
			'</table>'+
			'</div>';
			whisperToGM(msg.who,"gm",rt);
		
	};
	
	var handleOrderRoll = function(msg,character,id,name,count,availability,price,connection,tryself,pool){		
		if(connection != undefined){
			log(connection);
			var connection_name = attributes.S(attributes.get(character,"repeating_connections_"+connection+"_connections_name"));
			log(connection_name);
			var connection_loyality = attributes.I(attributes.get(character,"repeating_connections_"+connection+"_connections_loyality"));
			log(connection_loyality);
			var connection_rating = attributes.I(attributes.get(character,"repeating_connections_"+connection+"_connections_rating"));
			log(connection_rating);
			
			var connectionCharacter = characters.get(connection_name);
			if(connectionCharacter != undefined){
				log("Connection exists as character");
				log(connectionCharacter);
				var nameRegex = /repeating_skillsaction_[^_]+_skillsaction_id/;
				var skillIDs = filterObjs(function(o){return o.get('type')==='attribute' && o.get('characterid') === connectionCharacter.id && o.get('name').match(nameRegex);});
				var connectionButtons = "";
				_.each(skillIDs,function(sid){
					sid = attributes.S(sid);
					var satt = attributes.I(attributes.unwrap(connectionCharacter,"repeating_skillsaction_"+sid+"_skillsaction_attribut"));
					var sname = attributes.S(attributes.get(connectionCharacter,"repeating_skillsaction_"+sid+"_skillsaction_name"));
					var sbase = attributes.I(attributes.get(connectionCharacter,"repeating_skillsaction_"+sid+"_skillsaction_basis"));
					var smod = attributes.I(attributes.get(connectionCharacter,"repeating_skillsaction_"+sid+"_skillsaction_mod"));
					log(satt);
					log(sname);
					log(sbase);
					log(smod);
					if(sname.toLowerCase().trim() =="verhandlung"){
						pool = satt + sbase + smod;
					}
				});
			}
			
			if(pool == undefined){
				whisperTo(msg.who,msg.who,"Anfrage an den Spielleiter geschickt");
				/* Ask the GM for the NSC Pool*/
				var rt = '<div class="sheet-rolltemplate-roll">'+
				'<table class="sheet-box sheet-cyan">'+
				'<tr>'+	
				'<td class="sheet-text">'+
				'<div class="sheet-desc">'+msg.who+' möchte bei '+connection_name+'(L:'+connection_loyality+',E:'+connection_rating+') bestellen</div>'+
				'</td>'+
				'</tr>'+
				'<tr>'+
				'<td class="border-top" colspan="2"><div class="sheet-note">'+			
				count+"x "+name+" um "+price+"&yen; mit Verfügbarkeit "+availability+"<br/>"+
				'<a href="!shadowrun --character '+character.id+' --action order-buy-roll --id '+id+' --name '+name+' --count '+count+' --availability '+availability+' --connection '+connection+' --price '+price+' --pool ?{Pool|1}">Würfeln</a><br/>'+
				'</div></td>'+
				'</tr>'+
				'</table>'+
				'</div>';
				whisperTo(msg.who,"gm",rt);
				return;
			}else{
				var pool = pool + connection_rating;				
				var intervalX = 0;
				var intervalUnit = "";
				
				if(price<=100.0){
					intervalX = 6.0;
					intervalUnit = "Stunden";
				}else if(price<=1000.0){
					intervalX = 1.0;
					intervalUnit = "Tag";
				}else if(price<=10000.0){
					intervalX = 2.0;
					intervalUnit = "Tage";
				}else if(price<=100000.0){
					intervalX = 1.0;
					intervalUnit = "Woche";
				}else{
					intervalX = 1.0;
					intervalUnit = "Monat";
				}			
				var outputText='<div class="sheet-rolltemplate-script extended-test"><table><tr class="header"><td class="who">'+connection_name+'<br/>'+pool+'W6</td><td class="what">'+pool+'W6 vs '+availability+'W6<br/>'+intervalX+' '+intervalUnit+'</td></tr>';
				
				var rollnumber = 0;
				var usedTime = 0;

				var processVendor = function(x) {
					var RollValueVendor = x[0].inlinerolls[0];
					var rollVendor = buildInline(RollValueVendor, undefined, undefined);
					var sVendor = parseInt(RollValueVendor["results"]["total"]);
					
					var processItem = function(x) {
						var RollValueItem = x[0].inlinerolls[0];
						var rollItem = buildInline(RollValueItem, undefined, undefined);
						var sItem = parseInt(RollValueItem["results"]["total"]);
						
						if(sVendor < sItem){
							usedTime += intervalX;
							
							outputText +='<tr class="extended-test-roll">';
							outputText +='<td class="extended-test-number">'+rollnumber+':'+usedTime+' '+intervalUnit+'</td>';
							outputText +='<td class="extended-test-successes">'+rollVendor+' vs '+rollItem+'</td>';
							outputText +='</tr>';

							if(rollnumber < 100){
								sendChat(character.get('name'), "/roll [["+pool+"d6sacs5cs6>5]]", processVendor);	
							}else{
								outputText +='<tr><td colspan="2">Nach 100 Versuchen abgebrochen</td></tr>';
								whisperToGM(msg.who,"gm",outputText);
							}
						}else if(sVendor==sItem){
							/* Double Time but found */
							usedTime += 2*intervalX;
							outputText +='<tr class="extended-test-roll">';
							outputText +='<td class="extended-test-number">'+rollnumber+':'+usedTime+' '+intervalUnit+'</td>';
							outputText +='<td class="extended-test-successes">'+rollVendor+' vs '+rollItem+'</td>';
							outputText +='</tr>';
							outputText +='</table></div>';
							whisperToGM(msg.who,"gm",outputText);
						}else{
							/* X / Net Successes */
							var ns = sVendor - sItem;
							/*extended-test*/
							usedTime += intervalX/ns;
							usedTime = Math.round(usedTime * 100) / 100;
							outputText +='<tr class="extended-test-roll">';
							outputText +='<td class="extended-test-number">'+rollnumber+':'+usedTime+' '+intervalUnit+'</td>';
							outputText +='<td class="extended-test-successes">'+rollVendor+' vs '+rollItem+'</td>';
							outputText +='</tr>';
							outputText +='</table></div>';
							whisperToGM(msg.who,"gm",outputText);
						}
					};
					rollnumber += 1;
					sendChat(character.get('name'), "/roll [["+availability+"d6sacs5cs6>5]]", processItem);
				};
				sendChat(character.get('name'), "/roll [["+pool+"d6sacs5cs6>5]]", processVendor);
			}
		}else{
			var pool = pool;
			var intervalX = 0;
			var intervalUnit = "";
			
			if(price<=100.0){
				intervalX = 6.0;
				intervalUnit = "Stunden";
			}else if(price<=1000.0){
				intervalX = 1.0;
				intervalUnit = "Tag";
			}else if(price<=10000.0){
				intervalX = 2.0;
				intervalUnit = "Tage";
			}else if(price<=100000.0){
				intervalX = 1.0;
				intervalUnit = "Wochen";
			}else{
				intervalX = 1.0;
				intervalUnit = "Monat";
			}			
			var outputText='<div class="sheet-rolltemplate-script extended-test"><table><tr class="header"><td class="who">'+msg.who+'<br/>'+pool+'W6</td><td class="what">'+pool+'W6 vs '+availability+'W6<br/>'+intervalX+' '+intervalUnit+'</td></tr>';
			
			var rollnumber = 0;
			var usedTime = 0;

			var processPlayer = function(x) {
				var RollValuePlayer = x[0].inlinerolls[0];
				var rollPlayer = buildInline(RollValuePlayer, undefined, undefined);
				var sPlayer = parseInt(RollValuePlayer["results"]["total"]);
				
				var processItem = function(x) {
					var RollValueItem = x[0].inlinerolls[0];
					var rollItem = buildInline(RollValueItem, undefined, undefined);
					var sItem = parseInt(RollValueItem["results"]["total"]);
					
					if(sPlayer < sItem){
						usedTime += intervalX*2;
						
						outputText +='<tr class="extended-test-roll">';
						outputText +='<td class="extended-test-number">'+rollnumber+':'+usedTime+' '+intervalUnit+'</td>';
						outputText +='<td class="extended-test-successes">'+rollPlayer+' vs '+rollItem+'</td>';
						outputText +='</tr>';

						if(rollnumber < 100){
							sendChat(character.get('name'), "/roll [["+pool+"d6sacs5cs6>5]]", processPlayer);	
						}else{
							outputText +='<tr><td colspan="2">Nach 100 Versuchen abgebrochen</td></tr>';
							whisperToGM(msg.who,"gm",outputText);
						}
					}else if(sPlayer==sItem){
						/* Double Time but found */
						usedTime += 2*intervalX;
						outputText +='<tr class="extended-test-roll">';
						outputText +='<td class="extended-test-number">'+rollnumber+':'+usedTime+' '+intervalUnit+'</td>';
						outputText +='<td class="extended-test-successes">'+rollPlayer+' vs '+rollItem+'</td>';
						outputText +='</tr>';
						outputText +='</table></div>';
						whisperToGM(msg.who,"gm",outputText);
					}else{
						/* X / Net Successes */
						var ns = sPlayer - sItem;
						/*extended-test*/
						usedTime += intervalX/ns;
						outputText +='<tr class="extended-test-roll">';
						outputText +='<td class="extended-test-number">'+rollnumber+':'+usedTime+' '+intervalUnit+'</td>';
						outputText +='<td class="extended-test-successes">'+rollPlayer+' vs '+rollItem+'</td>';
						outputText +='</tr>';
						outputText +='</table></div>';
						whisperToGM(msg.who,"gm",outputText);
					}
				};
				rollnumber += 1;
				sendChat(character.get('name'), "/roll [["+availability+"d6sacs5cs6>5]]", processItem);
			};
			sendChat(character.get('name'), "/roll [["+pool+"d6sacs5cs6>5]]", processPlayer);
		}
		
		
	}
	
	var handleOrderBuy = function(msg,character,id,name,count,availability,price){	
		//var itemname = attributes.get(character,"repeating_orders_"+id+"_orders_name");
		var nameRegex = /repeating_connections_[^_]+_connections_id/;
		var connectionIDs = filterObjs(function(o){return o.get('type')==='attribute' && o.get('characterid') === character.id && o.get('name').match(nameRegex);});
        var connectionButtons = "";
        _.each(connectionIDs,function(cid){
			cid = attributes.S(cid);
			log(cid);
            var cname = attributes.S(attributes.get(character,"repeating_connections_"+cid+"_connections_name"));
			log(cname);
			var rating = attributes.I(attributes.get(character,"repeating_connections_"+cid+"_connections_rating"));
			log(rating);
			var loyality = attributes.I(attributes.get(character,"repeating_connections_"+cid+"_connections_loyality"));
			log(loyality);
			var note = attributes.S(attributes.get(character,"repeating_connections_"+cid+"_connections_note"));
			log(note);
			connectionButtons += '<a href="!shadowrun --character '+character.id+' --action order-buy-roll --id '+id+' --name '+name+' --count '+count+' --availability '+availability+' --connection '+cid+' --price '+price+'">'+cname+'(L'+loyality+',E'+rating+')</a>';
        });
		
		var rt = '<div class="sheet-rolltemplate-roll">'+
			'<table class="sheet-box sheet-cyan">'+
			'<tr>'+	
			'<td class="sheet-text">'+
			'<div class="sheet-desc">Hey, ich bräuchte da was!</div>'+
			'</td>'+
			'</tr>'+
			'<tr>'+
			'<td class="border-top" colspan="2"><div class="sheet-note">'+			
			count+"x "+name+" um "+price+"&yen; mit Verfügbarkeit "+availability+"<br/>"+
			"Ich möchte es "+
			'<a href="!shadowrun --character '+character.id+' --action order-buy-roll --id '+id+' --name '+name+' --count '+count+' --availability '+availability+' --tryself True --price '+price+' --pool ?{Pool|1}">selbst</a> versuchen.<br/>'+
			"Ich möchte, dass es<br/>"+connectionButtons+"<br/>versucht."+
			'</div></td>'+
			'</tr>'+
			'</table>'+
			'</div>';		
		whisperToGM(msg.who,msg.who,rt);
	}
	
	var handleSummonSpirit = function(msg,character,spiritname,basis,mod,force){		
		var castpool = basis + mod;
		var spirit = characters.get("Geister-"+spiritname);
		
		if(spirit==undefined){
			whisperToGM(msg.who,msg.who," Geist: "+spiritname+" nicht gefunden");
			return;
		}
			
		var kon = Math.max(force+abilities.I(abilities.get(spirit,"Kon")),1);		
		var ges = Math.max(force+abilities.I(abilities.get(spirit,"Ges")),1);
		var rea = Math.max(force+abilities.I(abilities.get(spirit,"Ges")),1);
		var str = Math.max(force+abilities.I(abilities.get(spirit,"Str")),1);
		
		var wil = Math.max(force+abilities.I(abilities.get(spirit,"Wil")),1);
		var intu = Math.max(force+abilities.I(abilities.get(spirit,"Int")),1);
		var logic = Math.max(force+abilities.I(abilities.get(spirit,"Log")),1);
		var cha = Math.max(force+abilities.I(abilities.get(spirit,"Cha")),1);
		
		var edg = Math.max(force/parseInt(abilities.S(abilities.get(spirit,"Edg")).replace(/\//g,"")),1);
		var ess = Math.max(force+abilities.I(abilities.get(spirit,"Ess")),1);
		var mag = Math.max(force+abilities.I(abilities.get(spirit,"Mag")),1);
		
		var ini = abilities.S(abilities.get(spirit,"Ini"));
		var aini = abilities.S(abilities.get(spirit,"A-Ini"));
		
		var skills = abilities.S(abilities.get(spirit,"Fertigkeiten"));
		var powers = abilities.S(abilities.get(spirit,"Kräfte"));
		var additional_powers = abilities.S(abilities.get(spirit,"Zusätzliche-Kräfte"));
		var weaknesses = abilities.S(abilities.get(spirit,"Schwächen"));
		var specials = abilities.S(abilities.get(spirit,"Besonderheiten"));
		
		var skillsplit = skills.split(",").map(function(e){return e.trim();});
		var powerssplit = powers.split(",").map(function(e){return e.trim();});
		var weaknessessplit = weaknesses.split(",").map(function(e){return e.trim();});
		var additional_powerssplit = additional_powers.splitArgs(",").map(function(e){return e.trim();});
				
		// Unwrap the @{attribute}
		var drainattribute = attributes.I(attributes.unwrap(character,"tradition_drainattribute"));
		
		var drainmod = attributes.get(character,"tradition_drainmod");
		drainmod = attributes.I(drainmod);
		var drainpool = drainattribute + drainmod;

		//Roll for Summoner
		sendChat(character.get('name'), "/roll [["+castpool+"d6sacs5cs6>5kh"+force+"]]", function(x) {			
			Object.keys(x[0].inlinerolls).forEach(function(i) {
				var RollValueSummoner = x[0].inlinerolls[i];
				var rollCast = buildInline(RollValueSummoner, undefined, undefined);
				var successesSummoner = parseInt(RollValueSummoner["results"]["total"]);
				//Roll for Spirit
				sendChat(character.get('name'),"/roll [["+force+"d6sacs5cs6>5]]",function(x) {			
					Object.keys(x[0].inlinerolls).forEach(function(i) {
						var RollValueSpirit = x[0].inlinerolls[i];
						var rollSpirit = buildInline(RollValueSpirit, undefined, undefined);
						var successesSpirit = parseInt(RollValueSpirit["results"]["total"]);
						//Roll Entzug
						var totaldrain = Math.max(successesSpirit*2,2);
						var tasks = Math.max(successesSummoner-successesSpirit,0);
						sendChat(character.get('name'),"/roll [["+drainpool+"d6sacs5cs6>5]]",function(x) {			
							Object.keys(x[0].inlinerolls).forEach(function(i) {
								var RollValueDrain = x[0].inlinerolls[i];
								var rollDrain = buildInline(RollValueDrain, undefined, undefined);
								var successesDrain = parseInt(RollValueDrain["results"]["total"]);
								var draindamage = Math.max(totaldrain-successesDrain,0);
								
								if(tasks > 0){
									var newid = generateRowID();
									var name = "repeating_activespirits_"+newid+"_activespirits_name";
									createObj("attribute", {name: name, current: spiritname, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_stufe";
									createObj("attribute", {name: name, current: force, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_dienste";
									createObj("attribute", {name: name, current: tasks, max:"", _characterid: character.id});
									
									name = "repeating_activespirits_"+newid+"_activespirits_kon";
									createObj("attribute", {name: name, current: kon, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_str";
									createObj("attribute", {name: name, current: str, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_rea";
									createObj("attribute", {name: name, current: rea, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_ges";
									createObj("attribute", {name: name, current: ges, max:"", _characterid: character.id});
									
									name = "repeating_activespirits_"+newid+"_activespirits_int";
									createObj("attribute", {name: name, current: intu, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_log";
									createObj("attribute", {name: name, current: logic, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_wil";
									createObj("attribute", {name: name, current: wil, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_cha";
									createObj("attribute", {name: name, current: cha, max:"", _characterid: character.id});
									
									name = "repeating_activespirits_"+newid+"_activespirits_mag";
									createObj("attribute", {name: name, current: mag, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_ess";
									createObj("attribute", {name: name, current: ess, max:"", _characterid: character.id});
									name = "repeating_activespirits_"+newid+"_activespirits_edg";
									createObj("attribute", {name: name, current: edg, max:"", _characterid: character.id});
									
									var skillpool = force;
									for (var i = 0; i < skillsplit.length;i = i + 1) {
										var index = i + 1;
										var skillname = skillsplit[i];
										name = "repeating_activespirits_" + newid + "_activespirits_skill_" + index + "_name";
										createObj("attribute", {name: name, current: skillname, max:"", _characterid: character.id});
										name = "repeating_activespirits_" + newid + "_activespirits_skill_" + index + "_pool";
										createObj("attribute", {name: name, current: skillpool, max:"", _characterid: character.id});																				
									}
									
									for (var i = 0; i < powerssplit.length;i = i + 1) {
										var index = i + 1;
										var powername = powerssplit[i];
										name = "repeating_activespirits_" + newid + "_activespirits_power_" + index + "_name";
										createObj("attribute", {name: name, current: powername, max:"", _characterid: character.id});
										name = "repeating_activespirits_" + newid + "_activespirits_power_" + index + "_pool";
										createObj("attribute", {name: name, current: skillpool, max:"", _characterid: character.id});																				
									}
									
									for (var i = 0; i < weaknessessplit.length;i = i + 1) {
										var index = i + 1;
										var weaknessname = weaknessessplit[i];
										name = "repeating_activespirits_" + newid + "_activespirits_weakness_" + index + "_name";
										createObj("attribute", {name: name, current: weaknessname, max:"", _characterid: character.id});
										name = "repeating_activespirits_" + newid + "_activespirits_weakness_" + index + "_pool";
										createObj("attribute", {name: name, current: skillpool, max:"", _characterid: character.id});																				
									}
									
									var add_power_button = "";
									for (var i = 0; i < additional_powerssplit.length;i = i + 1) {
										var index = i + 1;
										var additionalpower = additional_powerssplit[i];
										additionalpower = additionalpower.replace(/"/g,"").replace(/\([^)]*\)/g,"").trim();
										add_power_button = add_power_button + "["+additionalpower+"](!shadowrun --character "+character.id+" --action spirit-select-additional-power --power-name '"+additionalpower+"' --spirit-id "+newid+")";
									}
									
									var message = "&{template:geist}"+
										"{{text=beschwört }}"+
										"{{name="+spiritname+"}}"+
										"{{basis="+basis+"}}"+
										"{{mod="+mod+"}}"+
										"{{pool="+castpool+"}}"+
										"{{erfolge="+rollCast+"}}"+
										"{{geist-erfolge="+rollSpirit+"}}"+
										"{{entzugsschaden="+totaldrain+"-"+rollDrain+"="+draindamage+"}}"+
										"{{dienste="+tasks+"}}"+
										"{{ks="+force+"}}"+
										"{{kon="+kon+"}}"+
										"{{ges="+ges+"}}"+
										"{{rea="+rea+"}}"+
										"{{str="+str+"}}"+
										"{{wil="+wil+"}}"+
										"{{log="+logic+"}}"+
										"{{int="+intu+"}}"+
										"{{cha="+cha+"}}"+
										"{{edg="+edg+"}}"+
										"{{ess="+ess+"}}"+
										"{{mag="+mag+"}}"+
										"{{ini="+ini+"}}"+
										"{{a-ini="+aini+"}}"+
										"{{fertigkeiten="+skills+"}}"+
										"{{kräfte="+powers+"}}"+
										"{{zusätzliche-kräfte="+add_power_button+"}}"+
										"{{schwächen="+weaknesses+"}}"+
										"{{besonderheiten="+specials+"}}";
									whisperToGM(msg.who,msg.who,message);
								}else{							
									var message = "&{template:geist}"+
										"{{text=beschwört }}"+
										"{{name="+spiritname+"}}"+
										"{{basis="+basis+"}}"+
										"{{mod="+mod+"}}"+
										"{{ks="+force+"}}"+
										"{{pool="+castpool+"}}"+
										"{{erfolge="+rollCast+"}}"+
										"{{geist-erfolge="+rollSpirit+"}}"+
										"{{entzugsschaden="+totaldrain+"-"+rollDrain+"="+draindamage+"}}";
									whisperToGM(msg.who,msg.who,message);
								}
							});
						});
					});
				});
			});
		});		
	};
	
	var handleAlchemyPrepare = function(msg,character,spellname,force,basis,mod,trigger,trigger_name){		
		var castpool = basis + mod;
	
		var spell = characters.get("Zauber-"+spellname);
		if(spell==undefined){
			whisperToGM(msg.who,msg.who,"Zauber: "+spellname+" nicht gefunden");
			return;
		}
		
		var art = abilities.S(abilities.get(spell,"Art"));
		var category = abilities.S(abilities.get(spell,"Kategorie"));
		var range = abilities.S(abilities.get(spell,"Reichweite"));
		var damage = abilities.S(abilities.get(spell,"Schaden"));
		var duration = abilities.S(abilities.get(spell,"Dauer"));
		var drain = abilities.I(abilities.get(spell,"Entzug"));
		var description = abilities.S(abilities.get(spell,"Beschreibung"));
		
		// Unwrap the @{attribute}
		var drainattribute = attributes.I(attributes.unwrap(character,"tradition_drainattribute"));
		var drainmod = attributes.I(attributes.get(character,"tradition_drainmod"));
		var drainpool = drainattribute + drainmod;
		var wirksamkeit = 0;
		//Alchemist roll
		sendChat(character.get('name'), "/roll [["+castpool+"d6sacs5cs6>5kh"+force+"]]", function(x) {			
			Object.keys(x[0].inlinerolls).forEach(function(i) {
				var RollValueAlchemist = x[0].inlinerolls[i];
				var rollCast = buildInline(RollValueAlchemist, undefined, undefined);
				var successesAlchemist = parseInt(RollValueAlchemist["results"]["total"]);
				//Roll for Preparations
				sendChat(character.get('name'),"/roll [["+force+"d6sacs5cs6>5]]",function(x) {			
					Object.keys(x[0].inlinerolls).forEach(function(i) {
						var RollValuePreparation = x[0].inlinerolls[i];
						var rollPreparation = buildInline(RollValuePreparation, undefined, undefined);
						var successesPreparation = parseInt(RollValuePreparation["results"]["total"]);
						var totaldrain = Math.max(force + drain + trigger,2);
						wirksamkeit = Math.max(successesAlchemist-successesPreparation,0);
						sendChat(character.get('name'),"/roll [["+drainpool+"d6sacs5cs6>5]]",function(x) {			
							var RollValueDrain = 0;
							var i = 1;
							Object.keys(x[0].inlinerolls).forEach(function(i) {
								RollValueDrain = x[0].inlinerolls[i];
								var rollDrain = buildInline(RollValueDrain, undefined, undefined);
								var successesDrain = parseInt(RollValueDrain["results"]["total"]);
								var draindamage = Math.max(totaldrain-successesDrain,0);
								
								if(wirksamkeit>0){
									var newid = generateRowID();
									var name = "repeating_preparations_"+newid+"_preparations_name";
									createObj("attribute", {name: name, current: spellname, max:"", _characterid: character.id});
									name = "repeating_preparations_"+newid+"_preparations_basis";
									createObj("attribute", {name: name, current: wirksamkeit, max:"", _characterid: character.id});
									name = "repeating_preparations_"+newid+"_preparations_mod";
									createObj("attribute", {name: name, current: force, max:"", _characterid: character.id});
									//name = "repeating_preparations_"+newid+"_preparations";
									//createObj("attribute", {name: name, current: 0, max:"", _characterid: character.id});
									name = "repeating_preparations_"+newid+"_preparations_date";
									createObj("attribute", {name: name, current: "", max:"", _characterid: character.id});										
									name = "repeating_preparations_"+newid+"_preparations_note";
									createObj("attribute", {name: name, current: "", max:"", _characterid: character.id});	
									name = "repeating_preparations_"+newid+"_preparations_id";
									createObj("attribute", {name: name, current: newid, max:"", _characterid: character.id});	
								}else{
									description = "Vorbereitung fehlgeschlagen.";
								}

								whisperToGM(msg.who,msg.who,"&{template:alchemie}"+
										"{{text=präpariert "+spellname+"}}"+
										"{{ks="+force+"}}"+
										"{{basis="+basis+"}}"+
										"{{mod="+mod+"}}"+
										"{{pool="+castpool+"}}"+
										"{{art="+art+"}}"+
										"{{schaden="+damage+"}}"+
										"{{kategorie="+category+"}}"+
										"{{reichweite="+range+"}}"+
										"{{dauer="+duration+"}}"+
										"{{entzug="+force+"+"+drain+"+"+trigger+"="+totaldrain+"}}"+
										"{{beschreibung="+description+"}}"+
										"{{erfolge="+rollCast+"-"+rollPreparation+"="+wirksamkeit+"}}"+
										"{{entzugswiderstand="+totaldrain+"-"+rollDrain+"="+draindamage+"}}"+
										"{{ausloeser="+trigger_name+"}}");
							});
						});
					});
				});
			});
		});		
	};
	
	var handleAlchemyUse = function(msg,character,id,force,wirksamkeit){
		var spellname = attributes.get(character,"repeating_preparations_"+id+"_preparations_name");		
		
		if(spellname==undefined){
			whisperToGM(msg.who,msg.who,"Präparat mit ID: "+id+" nicht gefunden");
			return;
		}
		
		spellname = attributes.S(spellname);		
		
		var wirksamkeit = attributes.I(attributes.get(character,"repeating_preparations_"+id+"_preparations_basis"));
		var force = attributes.I(attributes.get(character,"repeating_preparations_"+id+"_preparations_mod"));
		var castpool = wirksamkeit + force;
	
		var spell = characters.get("Zauber-"+spellname);
		
		if(spell==undefined){
			whisperToGM(msg.who,msg.who,"Zauber "+spellname+" nicht gefunden");
			return;
		}
		
		var art = abilities.S(abilities.get(spell,"Art"));
		var category = abilities.S(abilities.get(spell,"Kategorie"));
		var range = abilities.S(abilities.get(spell,"Reichweite"));
		var damage = abilities.S(abilities.get(spell,"Schaden"));
		var duration = abilities.S(abilities.get(spell,"Dauer"));
		var drain = abilities.I(abilities.get(spell,"Entzug"));
		var description = abilities.S(abilities.get(spell,"Beschreibung"));
		
		// Unwrap the @{attribute}
		var drainattribute = attributes.I(attributes.unwrap(character,"tradition_drainattribute"));
		var drainmod = attributes.I(attributes.get(character,"tradition_drainmod"));
		var drainpool = drainattribute + drainmod;
		
		var myid = id;
		//Cast roll
		sendChat(character.get('name'), "/roll [["+castpool+"d6sacs5cs6>5kh"+force+"]]", function(x) {			
			var RollValueCaster = x[0].inlinerolls[0];
				var rollCast = buildInline(RollValueCaster, undefined, undefined);
				var successesCaster = parseInt(RollValueCaster["results"]["total"]);
				var totaldrain = Math.max(force + drain,2);

				sendChat(character.get('name'),"/roll [["+drainpool+"d6sacs5cs6>5]]",function(x) {			
					var RollValueDrain = x[0].inlinerolls[0];
					var rollDrain = buildInline(RollValueDrain, undefined, undefined);
					var successesDrain = parseInt(RollValueDrain["results"]["total"]);
					var draindamage = Math.max(totaldrain-successesDrain,0);
					
					whisperToGM(msg.who,msg.who,"&{template:zauber}"+
						"{{text=zaubert "+spellname+"}}"+
						"{{beschreibung="+description+"}}"+
						"{{ks="+force+"}}"+
						"{{basis="+wirksamkeit+"}}"+
						"{{mod="+force+"}}"+
						"{{pool="+castpool+"}}"+
						"{{erfolge="+rollCast+"}}"+
						"{{art="+art+"}}"+
						"{{schaden="+damage+"}}"+
						"{{kategorie="+category+"}}"+
						"{{reichweite="+range+"}}"+
						"{{entzug="+force+"+"+drain+"="+totaldrain+"}}"+
						"{{entzugswiderstand="+totaldrain+"-"+rollDrain+"="+draindamage+"}}"+
						"{{dauer="+duration+"}}");						
				
					spellname = attributes.get(character,"repeating_preparations_"+myid+"_preparations_name");				
					spellname.remove();
					
					wirksamkeit = attributes.get(character,"repeating_preparations_"+myid+"_preparations_basis");
					wirksamkeit.remove();
					
					force = attributes.get(character,"repeating_preparations_"+myid+"_preparations_mod");
					force.remove();
					
					castpool = attributes.get(character,"repeating_preparations_"+myid+"_preparations");
					castpool.remove();
					
					var note = attributes.get(character,"repeating_preparations_"+myid+"_preparations_note");
					note.remove();						

					var preparations_date = attributes.get(character,"repeating_preparations_"+myid+"_preparations_date");
					preparations_date.remove();
					
					var id = attributes.get(character,"repeating_preparations_"+myid+"_preparations_id");
					id.remove();
				});
		});
	};
	
	var handleSpellcastingCast = function(msg,character,spellname,id,force,basis,mod){			
		var castpool = basis + mod;
		var spell = characters.get("Zauber-"+spellname);
		
		if(spell==undefined){
			whisperToGM(msg.who,msg.who," Zauber "+spellname+" nicht gefunden");
			return;
		}
		
		var art = abilities.S(abilities.get(spell,"Art"));
		var category = abilities.S(abilities.get(spell,"Kategorie"));
		var range = abilities.S(abilities.get(spell,"Reichweite"));
		var damage = abilities.S(abilities.get(spell,"Schaden"));
		var duration = abilities.S(abilities.get(spell,"Dauer"));
		var drain = abilities.I(abilities.get(spell,"Entzug"));
		var description = abilities.S(abilities.get(spell,"Beschreibung"));
		
		// Unwrap the @{attribute}
		var drainattribute = attributes.I(attributes.unwrap(character,"tradition_drainattribute"));
		var drainmod = attributes.I(attributes.get(character,"tradition_drainmod"));
		var drainpool = drainattribute + drainmod;
		
		var myid = id;
		//Cast roll
		sendChat(character.get('name'), "/roll [["+castpool+"d6sacs5cs6>5kh"+force+"]]", function(x) {			
			var RollValueCaster = x[0].inlinerolls[0];
			var rollCast = buildInline(RollValueCaster, undefined, undefined);
			var successesCaster = parseInt(RollValueCaster["results"]["total"]);
			var totaldrain = Math.max(force + drain,2);

			sendChat(character.get('name'),"/roll [["+drainpool+"d6sacs5cs6>5]]",function(x) {			
				var RollValueDrain = x[0].inlinerolls[0];
				var rollDrain = buildInline(RollValueDrain, undefined, undefined);
				var successesDrain = parseInt(RollValueDrain["results"]["total"]);
				var draindamage = Math.max(totaldrain-successesDrain,0);
				
				whisperToGM(msg.who,msg.who,"&{template:zauber}"+
					"{{text=zaubert "+spellname+"}}"+
					"{{beschreibung="+description+"}}"+
					"{{ks="+force+"}}"+
					"{{basis="+basis+"}}"+
					"{{mod="+mod+"}}"+
					"{{pool="+castpool+"}}"+
					"{{erfolge="+rollCast+"}}"+
					"{{art="+art+"}}"+
					"{{schaden="+damage+"}}"+
					"{{kategorie="+category+"}}"+
					"{{reichweite="+range+"}}"+
					"{{entzug="+force+"+"+drain+"="+totaldrain+"}}"+
					"{{entzugswiderstand="+totaldrain+"-"+rollDrain+"="+draindamage+"}}"+
					"{{dauer="+duration+"}}");									
			});
		});
	};
	
	var handleComplexFormUse = function(msg,character,name,id,force,basis,mod){			
		var pool = basis + mod;
		var spell = characters.get("Complex-Form-"+name);
		
		if(spell==undefined){
			whisperToGM(msg.who,msg.who," Komplexe Form "+name+" nicht gefunden");
			return;
		}
		
		var target = abilities.S(abilities.get(spell,"Ziel"));
		var duration = abilities.S(abilities.get(spell,"Dauer"));
		var fade = abilities.I(abilities.get(spell,"Schwund"));		
		var description = abilities.S(abilities.get(spell,"Beschreibung"));
		description = description.replace(/(?:\r\n|\r|\n)/g, '');
		
		// Unwrap the @{attribute}
		var res = attributes.I(attributes.get(character,"res"));
		var wil = attributes.I(attributes.get(character,"wil"));
		var fadepool = res + wil;
		
		var myid = id;
		//Cast roll
		sendChat(character.get('name'), "/roll [["+pool+"d6sacs5cs6>5kh"+force+"]]", function(x) {			
			var RollValueTechnomancer = x[0].inlinerolls[0];
			var rollTechnomancer = buildInline(RollValueTechnomancer, undefined, undefined);
			var successesTechnomancer = parseInt(RollValueTechnomancer["results"]["total"]);
			var totalfade = Math.max(force + fade,2);

			sendChat(character.get('name'),"/roll [["+fadepool+"d6sacs5cs6>5]]",function(x) {			
				var RollValueFade = x[0].inlinerolls[0];
				var rollFade = buildInline(RollValueFade, undefined, undefined);
				var successesFade = parseInt(RollValueFade["results"]["total"]);
				var fadedamage = Math.max(totalfade-successesFade,0);
				
				whisperToGM(msg.who,msg.who,"&{template:complex-form}"+
					"{{text=nutzt "+name+"}}"+
					"{{beschreibung="+description+"}}"+
					"{{stufe="+force+"}}"+
					"{{basis="+basis+"}}"+
					"{{mod="+mod+"}}"+
					"{{pool="+pool+"}}"+
					"{{erfolge="+rollTechnomancer+"}}"+
					"{{ziel="+target+"}}"+
					"{{dauer="+duration+"}}"+
					"{{schwund="+force+"+"+fade+"="+totalfade+"}}"+
					"{{schwundwiderstand="+totalfade+"-"+rollFade+"="+fadedamage+"}}");									
			});
		});
	};
	
	var handleCompileSprite = function(msg,character,spritename,basis,mod,force){		
		var compilepool = basis + mod;
		var sprite = characters.get("Sprites-"+spritename);
		
		if(sprite==undefined){
			whisperToGM(msg.who,msg.who," Sprite: "+spritename+" nicht gefunden.");
			return;
		}
			
		var attack = Math.max(force+abilities.I(abilities.get(sprite,"Angriff")),1);		
		var sleaze = Math.max(force+abilities.I(abilities.get(sprite,"Schleicher")),1);
		var dataprocessing = Math.max(force+abilities.I(abilities.get(sprite,"Datenverarbeitung")),1);
		var firewall = Math.max(force+abilities.I(abilities.get(sprite,"Firewall")),1);
				
		var spriteres = force;
		
		var ini = abilities.S(abilities.get(sprite,"Initiative"));
		var description = abilities.S(abilities.get(sprite,"Beschreibung"));
		
		var skills = abilities.S(abilities.get(sprite,"Fertigkeiten"));
		var powers = abilities.S(abilities.get(sprite,"Kräfte"));		
		
		var skillsplit = skills.split(",").map(function(e){return e.trim();});
		var powerssplit = powers.split(",").map(function(e){return e.trim();});		
				
		// Unwrap the @{attribute}
		var res = attributes.I(attributes.get(character,"res"));
		var wil = attributes.I(attributes.get(character,"res"));
		var fadepool = res+wil;
		
		//Roll for Technomancer
		sendChat(character.get('name'), "/roll [["+compilepool+"d6sacs5cs6>5kh"+force+"]]", function(x) {			
			Object.keys(x[0].inlinerolls).forEach(function(i) {
				var RollValueTechnomancer = x[0].inlinerolls[i];
				var rollCompile = buildInline(RollValueTechnomancer, undefined, undefined);
				var successesTechnomancer = parseInt(RollValueTechnomancer["results"]["total"]);
				//Roll for Sprite
				sendChat(character.get('name'),"/roll [["+force+"d6sacs5cs6>5]]",function(x) {			
					Object.keys(x[0].inlinerolls).forEach(function(i) {
						var RollValueSprite = x[0].inlinerolls[i];
						var rollSprite = buildInline(RollValueSprite, undefined, undefined);
						var successesSprite = parseInt(RollValueSprite["results"]["total"]);
						//Roll Entzug
						var totalfade = Math.max(successesSprite*2,2);
						var tasks = Math.max(successesTechnomancer-successesSprite,0);
						sendChat(character.get('name'),"/roll [["+fadepool+"d6sacs5cs6>5]]",function(x) {			
							Object.keys(x[0].inlinerolls).forEach(function(i) {
								var RollValueFade = x[0].inlinerolls[i];
								var rollFade = buildInline(RollValueFade, undefined, undefined);
								var successesFade = parseInt(RollValueFade["results"]["total"]);
								var fadedamage = Math.max(totalfade-successesFade,0);
								
								if(tasks > 0){
									var newid = generateRowID();
									var name = "repeating_activesprites_"+newid+"_activesprites_name";
									createObj("attribute", {name: name, current: spritename, max:"", _characterid: character.id});
									name = "repeating_activesprites_"+newid+"_activesprites_stufe";
									createObj("attribute", {name: name, current: force, max:"", _characterid: character.id});
									name = "repeating_activesprites_"+newid+"_activesprites_dienste";
									createObj("attribute", {name: name, current: tasks, max:"", _characterid: character.id});
																		
									name = "repeating_activesprites_"+newid+"_activesprites_attack";
									createObj("attribute", {name: name, current: attack, max:"", _characterid: character.id});
									name = "repeating_activesprites_"+newid+"_activesprites_sleaze";
									createObj("attribute", {name: name, current: sleaze, max:"", _characterid: character.id});
									name = "repeating_activesprites_"+newid+"_activesprites_dataprocessing";
									createObj("attribute", {name: name, current: dataprocessing, max:"", _characterid: character.id});
									name = "repeating_activesprites_"+newid+"_activesprites_firewall";
									createObj("attribute", {name: name, current: firewall, max:"", _characterid: character.id});
									
									name = "repeating_activesprites_"+newid+"_activesprites_res";
									createObj("attribute", {name: name, current: spriteres, max:"", _characterid: character.id});
									
									var skillpool = force;
									for (var i = 0; i < skillsplit.length;i = i + 1) {
										var index = i + 1;
										var skillname = skillsplit[i];
										name = "repeating_activesprites_" + newid + "_activesprites_skill_" + index + "_name";
										createObj("attribute", {name: name, current: skillname, max:"", _characterid: character.id});
										name = "repeating_activesprites_" + newid + "_activesprites_skill_" + index + "_pool";
										createObj("attribute", {name: name, current: skillpool, max:"", _characterid: character.id});																				
									}
									
									for (var i = 0; i < powerssplit.length;i = i + 1) {
										var index = i + 1;
										var powername = powerssplit[i];
										name = "repeating_activesprites_" + newid + "_activesprites_power_" + index + "_name";
										createObj("attribute", {name: name, current: powername, max:"", _characterid: character.id});
										name = "repeating_activesprites_" + newid + "_activesprites_power_" + index + "_pool";
										createObj("attribute", {name: name, current: skillpool, max:"", _characterid: character.id});																				
									}
									
									var message = "&{template:sprite}"+
										"{{text=kompiliert }}"+
										"{{name="+spritename+"}}"+
										"{{basis="+basis+"}}"+
										"{{mod="+mod+"}}"+
										"{{pool="+compilepool+"}}"+
										"{{erfolge="+rollCompile+"}}"+
										"{{sprite-erfolge="+rollSprite+"}}"+
										"{{fadeschaden="+totalfade+"-"+rollFade+"="+fadedamage+"}}"+
										"{{tasks="+tasks+"}}"+
										"{{stufe="+force+"}}"+
										"{{angriff="+attack+"}}"+
										"{{schleicher="+sleaze+"}}"+
										"{{datenverarbeitung="+dataprocessing+"}}"+
										"{{firewall="+firewall+"}}"+										
										"{{resonanz="+spriteres+"}}"+
										"{{initiative="+ini+"}}"+
										"{{fertigkeiten="+skills+"}}"+
										"{{kräfte="+powers+"}}"+
										"{{beschreibung="+description+"}}";
									whisperToGM(msg.who,msg.who,message);
								}else{							
									var message = "&{template:sprite}"+
										"{{text=scheitert bei Kompilierung von }}"+
										"{{name="+spritename+"}}"+
										"{{basis="+basis+"}}"+
										"{{mod="+mod+"}}"+
										"{{pool="+compilepool+"}}"+
										"{{erfolge="+rollCompile+"}}"+
										"{{sprite-erfolge="+rollSprite+"}}"+
										"{{fadeschaden="+totalfade+"-"+rollFade+"="+fadedamage+"}}"+
										"{{stufe="+force+"}}";
									whisperToGM(msg.who,msg.who,message);
								}
							});
						});
					});
				});
			});
		});		
	};
	
	var handleLinkedBars = function(token){
		var represents = token.get('represents');
		var bar1_link = token.get('bar1_link');
		var bar2_link = token.get('bar2_link');
		var bar3_link = token.get('bar3_link');
		if(represents){
			var character = characters.get_by_id(represents);
			if(bar1_link){
				//Update Injury Mod
				var injury_mod = attributes.get(character,"injury_mod");
				var im = attributes.I(injury_mod);
				if(isNaN(parseInt(im))){
					im = 0;
					attributes.set(injury_mod,0);
				}
				var injury_mod_negative = attributes.get(character,"injury_mod_negative");
				attributes.set(injury_mod_negative,-im);
				
				var use_injury = attributes.get(character,"use_injury_mod");
				var cmd_injury_mod = attributes.get(character,"cmd_injury_mod");
				var cmd_injury_text = attributes.get(character,"cmd_injury_text");
				
				if(cmd_injury_mod == undefined){
					log("Create cmd_injury_mod for");
					createObj("attribute", {name: "cmd_injury_mod",current: 0,characterid: represents});
					cmd_injury_mod = attributes.get(character,"cmd_injury_mod");
				}
				
				if(use_injury.get('current') == "on" && attributes.I(injury_mod) > 0){
					attributes.set(cmd_injury_mod,"-@{injury_mod}");
					attributes.set(cmd_injury_text,"{{injurymod=-@{injury_mod}}}");					;						
				}else{
					attributes.set(cmd_injury_mod,"");
					attributes.set(cmd_injury_text,"");
				}
			}
			if(bar2_link && bar3_link){
				updateConditionMonitorAndInjury(character);
			}
		}
	};
	
	var updateConditionMonitorAndInjury = function(character){
		var zmg_aktuell = attributes.get(character,"zmg_aktuell");
		var zmg_maximum = attributes.get(character,"zmg_maximum");
		var zmg_toleranz = attributes.get(character,"zmg_toleranz");
	
		var zmp_aktuell = attributes.get(character,"zmp_aktuell");
		var zmp_maximum = attributes.get(character,"zmp_maximum");
		var zmp_toleranz = attributes.get(character,"zmp_toleranz");
	
		var overflow_aktuell = attributes.get(character,"overflow_aktuell");
		var overflow_maximum  = attributes.get(character,"overflow_maximum");
		var overflow_toleranz = attributes.get(character,"overflow_toleranz");			
	
		var injury_mod = attributes.get(character,"injury_mod");
		
		if(zmg_aktuell == undefined ||zmg_maximum==undefined||zmg_toleranz==undefined||
		zmp_aktuell==undefined||zmp_maximum==undefined||zmp_toleranz==undefined||
		overflow_aktuell==undefined||overflow_maximum==undefined||overflow_toleranz==undefined||
		injury_mod==undefined){
			whisperToGM("gm","gm","Character "+character.get('name')+" has undefined condition monitor variables.");
			return;
		}
		var pc = attributes.I(zmp_aktuell);
		var pm = attributes.I(zmp_maximum);
		var pt = attributes.I(zmp_toleranz);
		if(pt<=0){
			attributes.set(zmp_toleranz,1);
			pt = 1;
		}
	
		var gc = attributes.I(zmg_aktuell);
		var gm = attributes.I(zmg_maximum);
		var gt = attributes.I(zmg_toleranz);
		if(gt<=0){
			attributes.set(zmg_toleranz,1);
			gt = 1;
		}
	
		var oc = attributes.I(overflow_aktuell);
		var om = attributes.I(overflow_maximum);
		var ot = attributes.I(overflow_toleranz);
		if(ot<=0){
			attributes.set(overflow_toleranz,1);
			ot = 1;
		}
		
	
		if(gc > gm + 1){
			//Overflow -> physical per 2 boxes
			var overflow = Math.floor((gc - gm)/2.0);
			pc = pc + overflow;
			//Substract overflow from mental
			gc = gc - overflow*2;			
		}
	
		if(pc > pm){
			var overflow = pc - pm;
			oc = oc + overflow;
			//Substract overflow from physical
			pc = pc - overflow;
		}
		var mod_p = Math.floor(pc/pt);
		var mod_g = Math.floor(gc/gt);
		var injurymod = mod_p + mod_g;
	
		attributes.set(zmg_aktuell,gc);
		attributes.setMax(zmg_aktuell,gm);
		attributes.set(zmp_aktuell,pc);
		attributes.setMax(zmp_aktuell,pm);
		attributes.set(overflow_aktuell,oc);
		attributes.set(injury_mod,injurymod);
		var maxinjurymod = Math.floor(pm/pt)+Math.floor(gm/gt);
		attributes.setMax(injury_mod,maxinjurymod);
	};
		
	var whisperTo = function(sender,reciever,msg){
		if(reciever.indexOf(" (GM)")>-1){
			reciever = "gm";
		}
		sendChat(sender,'/w \"'+reciever+'\" '+msg)
	}
	var whisperToGM = function(sender,reciever,msg){
		if(sender.indexOf("(GM)") == -1){
			whisperTo(sender,"gm",msg);
		}
		whisperTo(sender,reciever,msg);	
	}
	
	var registerEventHandlers = function() {
		on('chat:message', handleShadowrunInput);
		on('change:token', handleToken);		
	};

	return {
		CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());

var attributes = {
get:function(chr,att){
	var a = findObjs({_type: 'attribute', _characterid: chr.id, name: att},{caseInsensitive: true})[0];	
	//Create an attribute if it does not exist yet.
	//if(a == undefined){
	//	a = createObj('attribute', {
    //        characterid: chr.id,
    //        name: att,
    //        current: 0,
    //        max: 0
    //    });
	//}
	return a;
},
get_from_str:function(chr,str){
	var s = str.replace(/[\{\}@]/g,"");
	log("get_from_str("+s+")");
	var a = attributes.get(chr,s); 
	return a;
},
set:function(att,value){att.set({current:value});},
setMax:function(att,max){att.set({max:max});},
create:function(chr,name,value){createObj("attribute", {name: name, current: value, characterid: chr.id});},
I:function(attr){
	var x = parseInt(attr.get('current'));
	return isNaN(x)?0:x;
},
F:function(attr){
	var x = parseFloat(attr.get('current'));
	return isNaN(x)?0:x;
},
S:function(attr){
	var x = attr != undefined ? attr.get('current') : undefined;
	return x == undefined  ? "" : x;
},
unwrap:function(chr,att){
	//Unwraps @{log} to get(character,log)
	var attribute = attributes.S(attributes.get(chr,att)).replace(/[\{\}@]/g,"");
	return attributes.get(chr,attribute);
}
};

var abilities = {
get:function(chr,ab){return findObjs({_type: 'ability', _characterid: chr.id, name: ab},{caseInsensitive: true})[0];},
set:function(ab,value){ab.set({current:value});},
S:function(ab){
	var x = ab.get('action');
	return x == undefined  ? "" : x;
},
I:function(ab){
	var x = parseInt(ab.get('action'));
	return isNaN(x)?0:x;
}
};

var characters = {
get:function(name){return findObjs({_type: 'character', name: name},{caseInsensitive: true})[0];},
get_by_id:function(id){return findObjs({_type: 'character', id: id},{caseInsensitive: true})[0];}
};

on("ready",function(){
	'use strict';	
	Shadowrun.CheckInstall();
	Shadowrun.RegisterEventHandlers();	
	
	if(!state.Shadowrun) {
		state.Shadowrun = {};
	}
	if(state.Shadowrun["extendedTests"] == undefined) {
		state.Shadowrun["extendedTests"] = {};
	}
});

//Functions stolen from Aarons Post how to get UUID generation into the API
var generateUUID = (function() {
    "use strict";

    var a = 0, b = [];
    return function() {
        var c = (new Date()).getTime() + 0, d = c === a;
        a = c;
        for (var e = new Array(8), f = 7; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        } else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++){
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    };
}());

var generateRowID = function () {
    "use strict";
	var uuid = generateUUID().replace(/_/g, "Z");
	while(findObjs({id: uuid},{caseInsensitive: true}).length!=0){
		uuid = generateUUID().replace(/_/g, "Z");
	}	
    return uuid;
};

//Functions: Stolen from HoneyBadgers PowerCards

// INLINE ROLL COLORS
var INLINE_ROLL_DEFAULT = " background-color: #FFFEA2; border-color: #87850A; color: #000000;";
var INLINE_ROLL_CRIT_LOW = " background-color: #FFAAAA; border-color: #660000; color: #660000;";
var INLINE_ROLL_CRIT_HIGH = " background-color: #88CC88; border-color: #004400; color: #004400;";
var INLINE_ROLL_CRIT_BOTH = " background-color: #8FA4D4; border-color: #061539; color: #061539;";
var INLINE_ROLL_STYLE = "text-align: center; font-size: 100%; font-weight: bold; display: inline-block; min-width: 1.75em; height: 1em; margin-top: -1px; margin-bottom: 1px; padding: 0px 2px; border: 1px solid; border-radius: 3px;";
function buildInline(inlineroll, TrackerID, who) {	
	
    var InlineColorOverride = "";
    var values = [];
    var critRoll = false;
    var failRoll = false;
    var critCheck = false;
    var failCheck = false;
    var expandedCheck = false;
    var highRoll = false;
    var lowRoll = false;
    var noHighlight = false;
    var expandedRoll = false;
    var notInline = false;
    var addToTracker = false;

    inlineroll.results.rolls.forEach(function(roll) {
        var result = processRoll(roll, noHighlight, expandedRoll, critCheck, failCheck, notInline);
        if (result["critCheck"]) critCheck = true;
        if (result["failCheck"]) failCheck = true;
        if (result["noHighlight"]) noHighlight = true;
        if (result["expandedRoll"]) expandedRoll = true;
        if (result["notInline"]) notInline = true;
        if (result["addToTracker"]) {
            // ADD TOKEN OR CHARACTER OR DISPLAY NAME TO TURN ORDER TRACKER...
            var TrackerName = "";
            if (TrackerID.charAt(0) === "C") {
                var Char = getObj("character", TrackerID.substring(2));
                var Tok = findObjs({
                    type: 'graphic',
                    pageid: Campaign().get("playerpageid"),
                    represents: TrackerID.substring(2)
                });
                if (_.isEmpty(Tok) && Char !== undefined) TrackerName = Char.get("name");
                else TrackerID = Tok[0].id;
            } else if (TrackerID.charAt(0) === "T") TrackerID = TrackerID.substring(2);
            else TrackerName = who;
            
            // CHECK TURN ORDER FOR EXISTING ID... REPLACE PR VALUE IF FOUND...
            var turn_order = ("" === Campaign().get("turnorder")) ? [] : JSON.parse(Campaign().get("turnorder"));
            var pos = turn_order.map(function(z) {
                return z.id;
            }).indexOf(TrackerID);
            if (pos === -1) turn_order.push({
                id: TrackerID,
                pr: inlineroll.results.total,
                custom: TrackerName
            });
            else turn_order[pos]["pr"] = inlineroll.results.total;
            
            // OPEN THE INITIATIVE WINDOW IF IT'S CLOSED...
            if (!Campaign().get("initiativepage")) Campaign().set("initiativepage", true);
            
            // SEND TURN ORDER BACK TO THE CAMPAIGN() OBJECT...
            Campaign().set("turnorder", JSON.stringify(turn_order));
        }
        if (result.value !== "") values.push(result.value);
    });

    // OVERRIDE THE ROLL20 INLINE ROLL COLORS...
	var critclass="";
	if (critCheck && failCheck) critclass="importantroll";
    else if (critCheck && !failCheck) critclass="fullcrit";
    else if (!critCheck && failCheck) critclass="fullfail";
    else critclass="";
	
    /*if (critCheck && failCheck) InlineColorOverride = INLINE_ROLL_CRIT_BOTH;
    else if (critCheck && !failCheck) InlineColorOverride = INLINE_ROLL_CRIT_HIGH;
    else if (!critCheck && failCheck) InlineColorOverride = INLINE_ROLL_CRIT_LOW;
    else InlineColorOverride = INLINE_ROLL_DEFAULT;*/

    // PARSE TABLE RESULTS
    inlineroll.results.tableentries = _.chain(inlineroll.results.rolls)
        .filter(function(r) {
            var tbl = _.has(r, 'table');
            return _.has(r, 'table');
        })
        .reduce(function(memo, r) {
            _.each(r.results, function(i) {
                i = i.tableItem;
                if (!/^[+\-]?(0|[1-9][0-9]*)([.]+[0-9]*)?([eE][+\-]?[0-9]+)?$/.test(i.name)) {
                    memo.push({
                        name: i.name,
                        weight: i.weight,
                        table: r.table
                    });
                }
            });
            return memo;
        }, [])
        .value();

    // REMOVE ROLL OPTIONS LIKE NH, XPND, EMPTY BRACKETS, & ADD SPACING...
    inlineroll.expression = inlineroll.expression
        .replace(/\|nh|nh/, "")
        .replace(/\|xpnd|xpnd/i, "")
        .replace(/\|trkr|trkr/i, "")
        .replace(/\[\]/, "")
        .replace("<", "&" + "amp;" + "lt;")
        .replace(/\+/g, " + ")
        .replace(/\-/g, " - ")
        .replace(/\*/g, " * ")
        .replace(/\//g, " / ");
    // END ROLL OPTIONS

    // FINAL STEP...
    var rollOut = "";
    if (expandedRoll) {
        if (notInline) {
            rollOut = values.join("") + " = " + inlineroll.results.total;
        } else {
            rollOut = '<span title="Rolling: ' + inlineroll.expression + '=<br>' + values.join("");
            rollOut += '" class="inlinerollresult showtip tipsy">' + values.join("") + ' = ' + inlineroll.results.total + '</span>';
        }
    } else {
        if (notInline) {
            rollOut = inlineroll.results.total;
        } else {
            rollOut = '<span title="Rolling: ' + inlineroll.expression + '=<br>' + values.join("");
            rollOut += '" class="inlinerollresult showtip tipsy '+critclass+'">' + inlineroll.results.total + '</span>';
        }
    }
    // rollOut = (inlineroll.results.total === 0 && inlineroll.results.tableentries.length) ? '' : rollOut;
    rollOut = (inlineroll.results.tableentries.length) ? '' : rollOut;
    rollOut += _.map(inlineroll.results.tableentries, function(l) {
        return (notInline) ? l.name : '<span  title="Table: ' + l.table + ' ' + 'Weight: ' + l.weight + '" class="inlinerollresult showtip tipsy">' + l.name + '</span>';
    }).join('');
    return rollOut;
};

function processRoll(roll, noHighlight, expandedRoll, critCheck, failCheck, notInline, addToTracker) {
    if (roll.type === "C") {
        return {
            value: " " + roll.text + " "
        };
    } else if (roll.type === "L") {
        if (roll.text.match(/nh/i) !== null) noHighlight = true;
        if (roll.text.match(/xpnd/i) !== null) expandedRoll = true;
        if (roll.text.match(/txt/i) !== null) notInline = true;
        if (roll.text.match(/trkr/i) !== null) addToTracker = true;
        return {
            noHighlight: noHighlight,
            expandedRoll: expandedRoll,
            notInline: notInline,
            addToTracker: addToTracker
        };
    } else if (roll.type === "M") {
        if (roll.expr.toString().match(/\+|\-|\*|\\/g)) roll.expr = roll.expr.toString().replace(/\+/g, " + ").replace(/\-/g, " - ").replace(/\*/g, " * ").replace(/\//g, " / ");
        return {
            value: roll.expr
        };
    } else if (roll.type === "R") {
        var rollValues = [];
        _.each(roll.results, function(result) {
            if (result.tableItem !== undefined) {
                rollValues.push(result.tableItem.name);
            } else {
                critRoll = false;
                failRoll = false;
                if (noHighlight) {
                    critRoll = false;
                    failRoll = false;
                } else {
                    var Sides = roll.sides;
                    // CRITROLL CHECKS...
                    if (roll.mods && roll.mods["customCrit"]) {
                        var p = 0;
                        _.each(roll.mods["customCrit"], function() {
                            if (roll.mods["customCrit"][p]["comp"] === "<=" && result.v <= roll.mods["customCrit"][p]["point"]) critRoll = true;
                            if (roll.mods["customCrit"][p]["comp"] === "==" && result.v == roll.mods["customCrit"][p]["point"]) critRoll = true;
                            if (roll.mods["customCrit"][p]["comp"] === ">=" && result.v >= roll.mods["customCrit"][p]["point"]) critRoll = true;
                            p++;
                        });
                    } else {
                        if (result.v === Sides) critRoll = true;
                    }
                    // FAILROLL CHECKS...
                    if (roll.mods && roll.mods["customFumble"]) {
                        var p = 0;
                        _.each(roll.mods["customFumble"], function() {
                            if (roll.mods["customFumble"][p]["comp"] === "<=" && result.v <= roll.mods["customFumble"][p]["point"]) failRoll = true;
                            if (roll.mods["customFumble"][p]["comp"] === "==" && result.v == roll.mods["customFumble"][p]["point"]) failRoll = true;
                            if (roll.mods["customFumble"][p]["comp"] === ">=" && result.v >= roll.mods["customFumble"][p]["point"]) failRoll = true;
                            p++;
                        });
                    } else {
                        if (result.v === 1) failRoll = true;
                    }
                }
                if (expandedRoll) result.v = "<span style='" + (critRoll ? 'color: #040;' : (failRoll ? 'color: #600;' : '')) + "'>" + result.v + "</span>";
                else result.v = "<span style='" + (critRoll ? 'color: #0F0; font-size: 1.25em;' : (failRoll ? 'color: #F00; font-size: 1.25em;' : '')) + "'>" + result.v + "</span>";
                rollValues.push(result.v);
                if (critRoll) critCheck = true;
                if (failRoll) failCheck = true;
            }
        });
        return {
            value: "(" + rollValues.join(" + ") + ")",
            noHighlight: noHighlight,
            expandedRoll: expandedRoll,
            critCheck: critCheck,
            failCheck: failCheck,
            notInline: notInline,
            addToTracker: addToTracker
        };
    } else if (roll.type === "G") {
        var grollVal = [];
        _.each(roll.rolls, function(groll) {
            _.each(groll, function(groll2) {
                var result = processRoll(groll2, noHighlight, expandedRoll, critCheck, failCheck, notInline);
                grollVal.push(result.value);
                critCheck = critCheck || result.critCheck;
                failCheck = failCheck || result.failCheck;
                noHighlight = noHighlight || result.noHighlight;
                expandedRoll = expandedRoll || result.expandedRoll;
                notInline = notInline || result.notInline;
                addToTracker = addToTracker || result.addToTracker;
            });
        });
        return {
            value: "{" + grollVal.join(" ") + "}",
            noHighlight: noHighlight,
            expandedRoll: expandedRoll,
            critCheck: critCheck,
            failCheck: failCheck,
            notInline: notInline,
            addToTracker: addToTracker
        };
    }
};

function doInlineFormatting(content, ALLOW_URLS, ALLOW_HIDDEN_URLS, Rolls) {
    // REPLACE [^ID] with value...
    var RollID;
    while (content.indexOf("[^") !== -1) {
        RollID = content.match(/\[\^(.*?)\]/);
        if (Rolls["$" + RollID[1].split(".")[0]]) {
            switch (RollID[1].split(".")[1]) {
                case "total":
                    content = content.replace(RollID[0], Rolls["$" + RollID[1].split(".")[0]].total);
                case "base":
                    content = content.replace(RollID[0], Rolls["$" + RollID[1].split(".")[0]].base);
                case "ss":
                    content = content.replace(RollID[0], Rolls["$" + RollID[1].split(".")[0]].successes);
                case "ones":
                    content = content.replace(RollID[0], Rolls["$" + RollID[1].split(".")[0]].ones);
                default:
                content = content.replace(RollID[0], Rolls["$" + RollID[1].split(".")[0]].base);
            }
        } else {
            content = content.replace(RollID[0], "Roll ID Not Found");
        }
    }
    
    // PARSE FOR INLINE FORMATTING
    var urls = [],
        str,
        formatter = function(s) {
            return s
                .replace(/__(.*?)__/g, "<u>$1</u>")
                .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                .replace(/\/\/(.*?)\/\//g, "<i>$1</i>")
                .replace(/\^\^/g, "<br>")
                .replace(/\^\*/g, "<span></span>")
                .replace(/\$\$(#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}))\|(.*?)\$\$/g, "<span>$3</span>")
                .replace(/\~\~\~/g, "<hr/>")
                .replace(/\~\J(.*?)\~\J/g, "<div>$1</div>")
                .replace(/\~\L(.*?)\~\L/g, "<span>$1</span>")
                .replace(/\~\C(.*?)\~\C/g, "<div>$1</div>")
                .replace(/\~\R(.*?)\~\R/g, "<div>$1</div><div></div>")
                .replace(/\[\!(.*?)\!\]/g, "<span>$1</span>")
            ;
        };
    str = _.reduce(
        content.match(/@@.*?@@/g),
        function(m, s, i) {
            var parts = s.replace(/@@(.*)@@/, '$1').split(/\|\|/),
                url = parts.shift().replace(/^\s*(http(s)?:\/\/|\/\/()|())/, 'http$2://'),
                text = formatter(parts.join('||'));
            if (ALLOW_URLS) {
                if (ALLOW_HIDDEN_URLS) {
                    urls[i] = '<a href="' + url + '">' + (text || url) + '</a>';
                } else {
                    urls[i] = '<a href="' + url + '">' + text + ' [' + url + ']</a>';
                }
            } else {
                urls[i] = s;
            }
            return m.replace(s, '@@' + i + '@@');
        },
        content
    );
    str = formatter(str);
    return _.reduce(
        urls,
        function(m, s, i) {
            return m.replace('@@' + i + '@@', s);
        },
        str
    );
};