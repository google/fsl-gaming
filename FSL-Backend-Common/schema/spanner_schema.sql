-- Copyright 2022 Google LLC
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     https://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--

CREATE TABLE Config (
  configName STRING(50) NOT NULL,
  configValue STRING(50),
) PRIMARY KEY(configName);

CREATE TABLE PointSystemMap (
  actionName STRING(100),
  pointValue INT64,
) PRIMARY KEY(actionName);


CREATE TABLE User (
  userUuid STRING(36),
  mobileNumber STRING(13),
  isActive INT64 DEFAULT (1),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  role STRING(10),
) PRIMARY KEY(userUuid);

CREATE INDEX User_MobileNumber ON User(mobileNumber) STORING (isActive);

CREATE TABLE TeamDetails (
  teamUuid STRING(36),
  teamName STRING(50),
  availablePlayers INT64,
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
) PRIMARY KEY(teamUuid);

CREATE TABLE PlayerDetails (
  playerUuid STRING(36),
  teamUuid STRING(36),
  playerName STRING(50),
  credit INT64,
  category STRING(50),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Team_Details FOREIGN KEY (teamUuid) REFERENCES TeamDetails (teamUuid),
) PRIMARY KEY(playerUuid);

CREATE TABLE MatchDetails (
  matchUuid STRING(36),
  team1Uuid STRING(36),
  team2Uuid STRING(36),
  matchTime TIMESTAMP,
  matchStatus STRING(20),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Team_1_Details FOREIGN KEY (team1Uuid) REFERENCES TeamDetails (teamUuid),
  CONSTRAINT FK_Team_2_Details FOREIGN KEY (team2Uuid) REFERENCES TeamDetails (teamUuid),
) PRIMARY KEY(matchUuid);

CREATE TABLE ContestDetails (
  contestUuid STRING(36),
  matchUuid STRING(36),
  slot INT64,
  noOfWinners INT64,
  winnerTeamUuid STRING(36),
  contestStatus STRING(20),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Match_Details FOREIGN KEY (matchUuid) REFERENCES MatchDetails (matchUuid),
) PRIMARY KEY(contestUuid);

CREATE TABLE ContestLeaderboard (
  contestLeaderUuid STRING(36),
  contestUuid STRING(36),
  points INT64,
  contestStatus STRING(20),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Contest_Details FOREIGN KEY (contestUuid) REFERENCES ContestDetails (contestUuid),
) PRIMARY KEY(contestLeaderUuid);

CREATE TABLE PlayerLeaderboard (
  playerLeaderboardUuid STRING(36),
  playerUuid STRING(36),
  matchUuid STRING(36),
  points INT64,
  isActive INT64 DEFAULT (1),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Player_Details FOREIGN KEY (playerUuid) REFERENCES PlayerDetails (playerUuid),
  CONSTRAINT FK_Match_Details FOREIGN KEY (matchUuid) REFERENCES MatchDetails (matchUuid),
) PRIMARY KEY(playerLeaderboardUuid);

CREATE TABLE FantasyTeamDetails (
  fantasyTeamUuid STRING(36),
  userUuid STRING(36),
  contestUuid STRING(36),
  isActive INT64 DEFAULT (1),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_User_Details FOREIGN KEY (userUuid) REFERENCES UserDetails (userUuid),
  CONSTRAINT FK_Contest_Details FOREIGN KEY (contestUuid) REFERENCES ContestDetails (contestUuid),
) PRIMARY KEY(fantasyTeamUuid);

CREATE TABLE FantasyTeamSquadDetails (
  fantasyTeamSquadUuid STRING(36),
  fantasyTeamUuid STRING(36),
  playerUuid STRING(36),
  isActive INT64 DEFAULT (1),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Fantasy_Team_Details FOREIGN KEY (fantasyTeamUuid) REFERENCES FantasyTeamDetails (fantasyTeamUuid),
  CONSTRAINT FK_Contest_Details FOREIGN KEY (contestUuid) REFERENCES ContestDetails (contestUuid),
) PRIMARY KEY(fantasyTeamUuid);

CREATE TABLE MatchTimeline (
  matchTimelineUuid STRING(36),
  matchUuid STRING(36),
  batsmanUuid STRING(36),
  bowleruid STRING(36),
  over_count INT64,
  ball_count INT64,
  score INT64,
  hasLostWicket INT64 DEFAULT (0),
  batsmanOutUuid STRING(36),
  wicketType STRING(50),
  hasExtra INT64,
  extraType STRING(50),
  createdDate TIMESTAMP,
  lastUpdatedDate TIMESTAMP,
  CONSTRAINT FK_Batsman_Details FOREIGN KEY (batsmanUuid) REFERENCES PlayerDetails (playerUuid),
  CONSTRAINT FK_Bowler_Details FOREIGN KEY (bowleruid) REFERENCES PlayerDetails (playerUuid),
  CONSTRAINT FK_Batsma_Out_Details FOREIGN KEY (batsmanOutUuid) REFERENCES PlayerDetails (playerUuid),
  CONSTRAINT FK_Match_Details FOREIGN KEY (matchUuid) REFERENCES MatchDetails (matchUuid),
) PRIMARY KEY(matchTimelineUuid);

