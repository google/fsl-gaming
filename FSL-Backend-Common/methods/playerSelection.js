// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO: High-level file comment.

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