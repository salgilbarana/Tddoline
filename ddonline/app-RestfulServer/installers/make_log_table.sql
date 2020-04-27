
 DELIMITER $$
 USE `project-underworld-log`$$
 DROP EVENT IF EXISTS `create_log`$$
 CREATE EVENT `create_log` on SCHEDULE EVERY 1 day STARTS '2018-10-21 23:00:00' ON COMPLETION NOT PRESERVE
 ENABLE
	DO BEGIN
		DECLARE v_dtDate CHAR(8);
        
		SELECT CAST(DATE_FORMAT(ADDDATE(CURRENT_DATE(),INTERVAL 1 DAY),'%Y%m%d')AS CHAR) INTO v_dtDate;
		
        SET @tmpQuery1 = CONCAT("CREATE TABLE `log_",v_dtDate,"`(
		`srl` bigint(20) UNSIGNED NOT NULL auto_increment,
		`route` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT '���Ʈ',
		`req` text COLLATE utf8mb4_bin COMMENT '��û',
		`status` smallint(6) NOT NULL DEFAULT '0',
		`res` text COLLATE utf8mb4_bin COMMENT '����',
		`failType` tinyint(4) DEFAULT '0' COMMENT '���� Ÿ��',
		`ip` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ip �ּ�',
		`deviceId` varchar(50) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '����̽� id',
		`platformType` tinyint(4) DEFAULT NULL COMMENT '�÷��� Ÿ��',
		`clientVer` smallint(6) NOT NULL DEFAULT '0',
		`assetBundleVer` smallint(6) NOT NULL DEFAULT '0',
		`sessId` varchar(36) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Ƽ��',
		`userSrl` bigint(20) DEFAULT NULL COMMENT '���� srl',
		`execMs` smallint(6) NOT NULL COMMENT '���� �ð�',
		`regTs` int(10) UNSIGNED NOT NULL COMMENT '�����',
        PRIMARY KEY (`srl`),
        KEY `IX_userSrl` (`userSrl`),
        KEY `IX_route` (`route`) USING BTREE,
        KEY `IX_execMs` (`execMs`) USING BTREE
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
        ");
        
		PREPARE sQuery1 FROM @tmpQuery1;
        EXECUTE sQuery1;
        DEALLOCATE PREPARE sQuery1;

	END $$
DELIMITER ;