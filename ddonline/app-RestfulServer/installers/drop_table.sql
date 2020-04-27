 DELIMITER $$
 USE `project-underworld-log`$$
 DROP EVENT IF EXISTS `drop_log`$$
 CREATE EVENT `drop_log` on SCHEDULE EVERY 1 DAY STARTS '2018-10-21 23:00:00' ON COMPLETION NOT PRESERVE
 ENABLE
	DO BEGIN
		DECLARE v_dtDate CHAR(8);
        
		SELECT CAST(DATE_FORMAT(SUBDATE(CURRENT_DATE(),INTERVAL 2 MONTH),'%Y%m%d')AS CHAR) INTO v_dtDate;
		
        SET @tmpQuery1 = CONCAT("DROP TABLE `log_",v_dtDate,"`");
        
		PREPARE sQuery1 FROM @tmpQuery1;
        EXECUTE sQuery1;
        DEALLOCATE PREPARE sQuery1;

	END $$
DELIMITER ;