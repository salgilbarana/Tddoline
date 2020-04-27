-- --------------------------------------------------------

--
-- 테이블 구조 `characters`
--

CREATE TABLE `characters` (
  `srl` bigint(20) UNSIGNED NOT NULL COMMENT 'srl',
  `userSrl` bigint(20) UNSIGNED NOT NULL COMMENT '유저 srl',
  `ownerSrl` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_bin NOT NULL COMMENT '이름',
  `rareType` tinyint(4) NOT NULL DEFAULT '1' COMMENT '레어 타입',
  `sexType` tinyint(4) NOT NULL DEFAULT '1' COMMENT '성별 타입',
  `skinColorId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '스킨 컬러 ID',
  `hairId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '헤어 ID',
  `faceId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '얼굴 ID',
  `jobId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '직업 ID',
  `grade` tinyint(4) NOT NULL DEFAULT '1' COMMENT '등급',
  `citizenNamedId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '시티즌 네임드 ID',
  `str` tinyint(4) NOT NULL DEFAULT '0',
  `dex` tinyint(4) NOT NULL DEFAULT '0',
  `luck` tinyint(4) NOT NULL DEFAULT '0',
  `con` tinyint(4) NOT NULL DEFAULT '0',
  `pollutionLevel` tinyint(4) NOT NULL DEFAULT '0' COMMENT '오염도 레벨',
  `cureCnt` tinyint(4) NOT NULL DEFAULT '0' COMMENT '큐어 횟수',
  `exp` int(11) NOT NULL DEFAULT '0' COMMENT '경험치',
  `hp` int(11) NOT NULL DEFAULT '0',
  `rp` int(11) NOT NULL DEFAULT '0' COMMENT 'rp',
  `itemSuitId` smallint(6) NOT NULL DEFAULT '0',
  `itemMaskId` smallint(6) NOT NULL DEFAULT '0',
  `itemBotId` smallint(6) NOT NULL DEFAULT '0',
  `shelterFloorId` tinyint(4) NOT NULL DEFAULT '0',
  `shelterRoomSlot` tinyint(4) NOT NULL DEFAULT '0',
  `shelterRoomTaskStartTs` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `itemRecipeId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '아이템 레시피 ID',
  `isInside` tinyint(1) NOT NULL DEFAULT '0' COMMENT '입주 여부',
  `isExplore` tinyint(1) NOT NULL DEFAULT '0' COMMENT '탐험 여부',
  `desireId` tinyint(4) NOT NULL DEFAULT '0',
  `desireCnt` tinyint(4) NOT NULL DEFAULT '0',
  `lastExploreMapId` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 테이블 구조 `collections`
--

CREATE TABLE `collections` (
  `userSrl` bigint(20) UNSIGNED NOT NULL,
  `type` tinyint(4) NOT NULL,
  `refId` smallint(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 테이블 구조 `itemRecipes`
--

CREATE TABLE `itemRecipes` (
  `userSrl` bigint(20) UNSIGNED NOT NULL,
  `itemRecipeId` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 테이블 구조 `items`
--

CREATE TABLE `items` (
  `userSrl` bigint(20) UNSIGNED NOT NULL,
  `characterSrl` bigint(20) UNSIGNED NOT NULL,
  `itemId` smallint(6) NOT NULL COMMENT '아이템 ID',
  `cnt` smallint(6) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 테이블 구조 `maps`
--

CREATE TABLE `maps` (
  `userSrl` bigint(20) NOT NULL,
  `mapId` tinyint(4) NOT NULL,
  `isClear` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- --------------------------------------------------------

--
-- 테이블 구조 `posts`
--

CREATE TABLE `posts` (
  `srl` bigint(20) UNSIGNED NOT NULL,
  `userSrl` bigint(20) UNSIGNED NOT NULL,
  `sendUserSrl` bigint(20) UNSIGNED NOT NULL,
  `type` tinyint(4) NOT NULL,
  `ref` json DEFAULT NULL,
  `regTs` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 테이블 구조 `shelterFloors`
--

CREATE TABLE `shelterFloors` (
  `userSrl` bigint(20) UNSIGNED NOT NULL,
  `shelterFloorId` tinyint(4) NOT NULL,
  `level` tinyint(4) NOT NULL COMMENT '레벨'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 테이블 구조 `userDevices`
--

CREATE TABLE `userDevices` (
  `userSrl` bigint(20) UNSIGNED NOT NULL COMMENT '유저 srl',
  `deviceId` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '디바이스 id',
  `platformType` tinyint(4) NOT NULL COMMENT '플랫폼 타입',
  `regTs` int(10) UNSIGNED NOT NULL COMMENT '등록일'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin ROW_FORMAT=DYNAMIC;

-- --------------------------------------------------------

--
-- 테이블 구조 `users`
--

CREATE TABLE `users` (
  `srl` bigint(20) NOT NULL COMMENT 'srl',
  `channelType` tinyint(4) NOT NULL COMMENT '채널 type',
  `channelRefId` varchar(36) COLLATE utf8mb4_bin NOT NULL COMMENT '채널 RefId',
  `name` varchar(20) COLLATE utf8mb4_bin NOT NULL COMMENT '이름',
  `countryCode` char(2) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '국가 코드',
  `gold` int(11) NOT NULL DEFAULT '0' COMMENT '골드',
  `ruby` int(11) NOT NULL DEFAULT '0' COMMENT '루비',
  `inventoryLevel` tinyint(4) NOT NULL DEFAULT '1' COMMENT '인벤토리 레벨',
  `prepareBuffCntPerId` json DEFAULT NULL COMMENT '선행 버프 (Per Id)',
  `productCnt` int(11) NOT NULL DEFAULT '0' COMMENT '생산 횟수',
  `lastProductTs` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '최종 생산 시간',
  `lastDesireTs` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '최종 desire 시간',
  `lastRefreshMissionTs` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '최종 갱신 미션 시간',
  `lastLobbyAdTs` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '최종 로비 광고 시간',
  `expireProtectTs` int(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT '보호 만료 기간',
  `insideCharacterCnt` tinyint(3) UNSIGNED NOT NULL DEFAULT '0' COMMENT '인사이드 캐릭터 수',
  `lobbyAdCnt` tinyint(4) NOT NULL DEFAULT '0' COMMENT '로비 광고 수',
  `missionClearCnt` mediumint(9) NOT NULL DEFAULT '0' COMMENT '미션 클리어 수',
  `shelterUpgradeCnt` tinyint(4) NOT NULL DEFAULT '0' COMMENT '쉘터 업그레이드 수',
  `tutorialProcType` tinyint(1) NOT NULL DEFAULT '0' COMMENT '튜토리얼 처리 타입',
  `watchableAdMapId` tinyint(4) NOT NULL DEFAULT '0' COMMENT '시청 가능 맵 ID',
  `gateHp` smallint(6) NOT NULL DEFAULT '0' COMMENT '게이트 hp',
  `pvpWinCnt` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'pvp 승리 횟수',
  `pvpLoseCnt` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'pvp 패배 횟수',
  `bp` mediumint(9) NOT NULL DEFAULT '0' COMMENT 'bp',
  `isSkipAdForward` tinyint(1) NOT NULL DEFAULT '0' COMMENT '전면 광고 스킵 여부',
  `isSkipAdMovie` tinyint(1) NOT NULL DEFAULT '0' COMMENT '동영상 광고 스킵 여부',
  `isDropout` tinyint(1) NOT NULL DEFAULT '0' COMMENT '탈퇴 여부',
  `regTs` int(10) UNSIGNED NOT NULL COMMENT '등록일'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='유저' ROW_FORMAT=DYNAMIC;

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `characters`
--
ALTER TABLE `characters`
  ADD PRIMARY KEY (`srl`),
  ADD KEY `IX_userSrl` (`userSrl`),
  ADD KEY `IX_jobId` (`jobId`),
  ADD KEY `IX_isInside` (`isInside`),
  ADD KEY `IX_ownerSrl` (`ownerSrl`),
  ADD KEY `IX_shelterFloor` (`shelterFloorId`,`shelterRoomSlot`) USING BTREE;

--
-- 테이블의 인덱스 `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`userSrl`,`type`,`refId`) USING BTREE;

--
-- 테이블의 인덱스 `itemRecipes`
--
ALTER TABLE `itemRecipes`
  ADD PRIMARY KEY (`userSrl`,`itemRecipeId`);

--
-- 테이블의 인덱스 `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`userSrl`,`characterSrl`,`itemId`) USING BTREE;

--
-- 테이블의 인덱스 `maps`
--
ALTER TABLE `maps`
  ADD PRIMARY KEY (`userSrl`,`mapId`);

--
-- 테이블의 인덱스 `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`srl`) USING BTREE,
  ADD KEY `IX_userSrl` (`userSrl`);

--
-- 테이블의 인덱스 `shelterFloors`
--
ALTER TABLE `shelterFloors`
  ADD PRIMARY KEY (`userSrl`,`shelterFloorId`);

--
-- 테이블의 인덱스 `userDevices`
--
ALTER TABLE `userDevices`
  ADD PRIMARY KEY (`userSrl`,`deviceId`);

--
-- 테이블의 인덱스 `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`srl`),
  ADD KEY `IX_name` (`name`),
  ADD KEY `IX_channel` (`channelType`,`channelRefId`) USING BTREE,
  ADD KEY `IX_insideCharacterCnt_expireProtectTs` (`insideCharacterCnt`,`expireProtectTs`) USING BTREE,
  ADD KEY `IX_isDropout` (`isDropout`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `characters`
--
ALTER TABLE `characters`
  MODIFY `srl` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'srl';
--
-- 테이블의 AUTO_INCREMENT `posts`
--
ALTER TABLE `posts`
  MODIFY `srl` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `srl` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'srl';