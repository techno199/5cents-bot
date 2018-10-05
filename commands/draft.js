const config = require('../models/civs.json');
const parser = require('../parser');

const civs = config.civilizations;
const overallCivsCount = civs.length;
const mapTypes = config.mapTypes;
const ERROR_MSG = 'An error occurend trying to execute command';


module.exports = {
  name: 'draft',
  execute(message, args) {
    try {
      let argsMap = parser.parseArgs(args);
      let mapType = mapTypes.find(type => type.size == argsMap.attrs.playersCount);
      let defaultBans = [];
      
      // In case of incorrect amount of civs provided
      // we want to return appropriate message
      if (argsMap.attrs.playersCount < 2 || argsMap.attrs.playersCount > 12) {
        return message.channel.send('Players amount must be between 2 and 12');
      }

      // Skip default bans in case flag provided
      if(!parser.hasFlag(argsMap, 'no-default-bans')) {
        defaultBans = mapType ? mapType.defaultBans.slice() : config.defaultBans;
      }

      // Add custom bans in case them provided
      if (argsMap.attrs.bans) {
        defaultBans = defaultBans.concat(parseBans(argsMap))
      }

      message.channel.send(createDraft(argsMap.attrs.playersCount, defaultBans));
    }
    catch (error){
      message.channel.send(ERROR_MSG);
    }
  }
}

/**
 * Return draft message for each player considering bans
 * @param {string} playersCount Amount of players
 * @param {string[]} bannedCivs Array of banned leader names
 */
function createDraft(playersCount, bannedCivs) {
  let bannedCivsHeader;
  let civsPerPlayer = Math.floor((overallCivsCount - bannedCivs.length) / playersCount) 
  let amountOfPlayableCivs = civsPerPlayer * playersCount;

  // Leave allowed civ considering just bans
  let civsInDraft = civs
    .filter(civ => !bannedCivs.some(bannedCiv => bannedCiv === civ.leader));

  // Exclude the rest of allowed civs to distribute equal amount of them for each player
  while (civsInDraft.length > amountOfPlayableCivs) {
    let i = getRandomInt(0, civsInDraft.length - 1);
    bannedCivs.push(civsInDraft[i].leader);
    civsInDraft.splice(i, 1);
  }

  // Create banned civs header when all bans finally calculated
  bannedCivsHeader = _createBannedCivsHeader(bannedCivs);

  let randomizedCivsInDraft = [];
  while(civsInDraft.length > 0) {
    // Get random civ from sorted array
    let randomIndex = getRandomInt(0, civsInDraft.length - 1);
    randomizedCivsInDraft.push(civsInDraft[(randomIndex)]);
    // Remove civ from source array
    civsInDraft.splice(randomIndex, 1);
  }

  // Create draft message
  let 
    draft = '',
    playerTemplate = '',
    prevPlayerIndex = -1,
    currentPlayerIndex;
  
  for (let i in randomizedCivsInDraft) {
    playerTemplate = '';
    currentPlayerIndex = Math.floor(i / civsPerPlayer);

    // Mark player number when start iterating over next one
    if (currentPlayerIndex > prevPlayerIndex) {
      playerTemplate += `${currentPlayerIndex + 1}. `
    }

    playerTemplate += `${randomizedCivsInDraft[i].nation} - ${randomizedCivsInDraft[i].leader} / `;

    let nextNationPlayerIndex = Math.floor((+i + 1) / civsPerPlayer)
    if (nextNationPlayerIndex > currentPlayerIndex) {   
      // This state means that next nation will be assigned for next player.                           
      // In this case we want to delete trailing '/'
      playerTemplate = playerTemplate.replace('/', '\n\n');
    }
    draft += playerTemplate;
    prevPlayerIndex = currentPlayerIndex;
  }

  return `${bannedCivsHeader}\n\n${draft}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return an array of bans provided by argsMap.
 * If no bans provided or in case of incorrect input return an empty array
 * @param {argsMap} argsMap 
 */
function parseBans(argsMap) {
  let customBans = argsMap.attrs.bans,
    correctBans = [];
  if (!customBans) return correctBans;
  // Parse handmade array of civs
  customBans = customBans.split(',');

  // For every civilization we should check whether it's correct leader name
  // And if it is, add it to final array
  for (let ban of customBans) {
    let correctCivIndex = civs.findIndex(civ => civ.leader.toLowerCase().startsWith(ban.toLowerCase()))
    if (correctCivIndex !== -1) {
      correctBans.push(civs[correctCivIndex].leader);
    }
  }
  return correctBans;
}

/**
 * Returns banned civs message.
 * Removes duplicates
 * @param {string[]} bannedCivs leadernames
 */
function _createBannedCivsHeader(bannedCivs) {
  let leaderNames = {};
  for (let ban of bannedCivs) {
    leaderNames[ban] = null;
  }
  bannedCivs = [];
  for (let leaderName in leaderNames) {
    bannedCivs.push(leaderName);
  }
  return `Banned leaders: ${bannedCivs.join(', ') || 'none'}`
}