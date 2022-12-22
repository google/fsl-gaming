exports.playerSelection = (teamPlayers) => {
  
    const playerCounts = {
      Batsman: 4, Bowler: 4, 'All-Rounder': 2, 'Wicket-Keeper': 1,
    };
    selectedPlayers = [];
    for (let i = 0; i < teamPlayers.length && selectedPlayers.length < 11; i++) {
      if (teamPlayers[i].category == 'Batsman' && playerCounts[teamPlayers[i].category] > 0) {
        playerCounts[teamPlayers[i].category]--;
        selectedPlayers.push(teamPlayers[i]);
      } else if (teamPlayers[i].category == 'Bowler' && playerCounts[teamPlayers[i].category] > 0) {
        playerCounts[teamPlayers[i].category]--;
        selectedPlayers.push(teamPlayers[i]);
      } else if (teamPlayers[i].category == 'All-Rounder' && playerCounts[teamPlayers[i].category] > 0) {
        playerCounts[teamPlayers[i].category]--;
        selectedPlayers.push(teamPlayers[i]);
      } else if (teamPlayers[i].category == 'Wicket-Keeper' && playerCounts[teamPlayers[i].category] > 0) {
        playerCounts[teamPlayers[i].category]--;
        selectedPlayers.push(teamPlayers[i]);
      }
    }
    return selectedPlayers;
  };
  exports.fetchPlayerCount = (teamPlayers) => {
       
      const playerCounts = {
        Batsman: 0, Bowler: 0, 'All-Rounder': 0, 'Wicket-Keeper': 0,
      };
      for (let i = 0; i < teamPlayers.length ; i++) {
        if (teamPlayers[i].category == 'Batsman') {
          playerCounts[teamPlayers[i].category]++;
        } else if (teamPlayers[i].category == 'Bowler') {
          playerCounts[teamPlayers[i].category]++;
        } else if (teamPlayers[i].category == 'All-Rounder') {
          playerCounts[teamPlayers[i].category]++;
        } else if (teamPlayers[i].category == 'Wicket-Keeper') {
          playerCounts[teamPlayers[i].category]++;
        }
      }
      return playerCounts;
    };