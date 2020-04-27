#!/bin/bash

backupdate=$(date -d '2 month ago' +%Y%m%d)
deletedate=$(date -d '6 month ago' +%Y%m%d)
backup_dir="/home/touchholic/underworld/logs"
backup_sql_name="log_"$backupdate".sql"
backup_sql_table="log_"$backupdate
delete_sql_name="log_"$deletedate".sql"

mysqldump -uroot -pTouchholicRoot! project-underworld-log ${backup_sql_table} > ${backup_dir}/${backup_sql_name}

echo "Back up Done !"

rm -f /home/touchholic/underworld/logs/${delete_sql_name}

echo "Delete old sql Done !"
exit
~             
