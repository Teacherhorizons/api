-- spOpenApi_refreshIssues
DROP PROCEDURE IF EXISTS spOpenApi_refreshIssues;

DELIMITER $$
CREATE PROCEDURE spOpenApi_refreshIssues(p_databaseName VARCHAR(50))
/*
  CALL spOpenApi_refreshIssues('beta');
  
  SELECT * FROM openApi_issues ORDER BY entityId;
*/
BEGIN

DELETE FROM openApi_issues;

INSERT openApi_issues (databaseName, entityId, description)
SELECT p_databaseName, id, CONCAT('View not found for entity')
FROM bOpenApi_entities
WHERE viewName IS NULL OR viewName NOT IN (SELECT table_name FROM information_schema.VIEWS WHERE table_schema = p_databaseName);

INSERT openApi_issues (databaseName, entityId, description)
SELECT p_databaseName, p.entityId, CONCAT('Column not found for property ', p.name)
FROM bOpenApi_properties p
  LEFT OUTER JOIN (SELECT * FROM information_schema.COLUMNS WHERE table_schema = p_databaseName) c ON p.viewName = c.table_name AND p.name = c.column_name
WHERE c.table_catalog IS NULL AND p.isInDb = 1;

INSERT openApi_issues (databaseName, entityId, description)
SELECT p_databaseName, e.id, CONCAT('Property not found for column ', c.column_name)
FROM information_schema.COLUMNS c
  INNER JOIN bOpenApi_entities e ON c.table_name = e.viewName
  LEFT OUTER JOIN bOpenApi_properties p ON c.table_name = p.viewName AND c.column_name = p.name
WHERE table_schema = p_databaseName
  AND p.entityId IS NULL;

END $$
DELIMITER ;
-- /

/* TODO: add other issue types
  e.g. 'a view' exists without related entity
*/
