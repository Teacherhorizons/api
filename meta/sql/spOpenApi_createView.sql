-- spOpenApi_createView
DROP PROCEDURE IF EXISTS spOpenApi_createView;

DELIMITER $$
CREATE PROCEDURE spOpenApi_createView(p_databaseName VARCHAR(50), p_entityName VARCHAR(100), p_withDelete TINYINT)
/*
  CALL spOpenApi_createView('beta', 'school-academicSystem', 1);
  CALL spOpenApi_createView('teacher_horizons', 'school-academicSystem', 1);
*/
BEGIN
  SELECT tableName, viewName INTO @tableName, @viewName FROM staging.bOpenApi_entities WHERE `name` = p_entityName;

  IF (p_withDelete = 1) THEN
    SET @s = CONCAT('drop view if exists ', p_databaseName, '.', @viewName, ';');
    PREPARE stmt FROM @s;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
  END IF;
  
  SELECT GROUP_CONCAT(CONCAT('\n    `', IFNULL(p.columnName, p.name), '` AS `', p.name, '`') ORDER BY p.precedence)
  INTO @columns
  FROM staging.bOpenApi_properties p
  WHERE entityName = p_entityName AND isInDb = 1;
  
  SET @s = CONCAT('CREATE VIEW ', p_databaseName, '.', @viewName, ' AS
  SELECT',
    @columns,
  '
  FROM ', p_databaseName, '.', @tableName, ';');
  
  SELECT @s AS `SQL`;

  PREPARE stmt FROM @s;
  EXECUTE stmt;
  DEALLOCATE PREPARE stmt;
END $$
DELIMITER ;
-- /