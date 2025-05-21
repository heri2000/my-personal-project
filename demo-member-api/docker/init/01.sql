-- CREATE DATABASE IF NOT EXISTS ht_demo_test;
-- CREATE DATABASE IF NOT EXISTS ht_demo_dev;
CREATE DATABASE IF NOT EXISTS ht_demo;

-- GRANT ALL PRIVILEGES ON ht_demo_test.* TO 'ht_demo'@'%';
-- GRANT ALL PRIVILEGES ON ht_demo_dev.* TO 'ht_demo'@'%';
GRANT ALL PRIVILEGES ON ht_demo.* TO 'ht_demo'@'%';

FLUSH PRIVILEGES;
