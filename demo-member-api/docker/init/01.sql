-- CREATE DATABASE IF NOT EXISTS heri_tny_demo_test;
-- CREATE DATABASE IF NOT EXISTS heri_tny_demo_dev;
CREATE DATABASE IF NOT EXISTS heri_tny_demo;

-- GRANT ALL PRIVILEGES ON heri_tny_demo_test.* TO 'heri_tny_demo'@'%';
-- GRANT ALL PRIVILEGES ON heri_tny_demo_dev.* TO 'heri_tny_demo'@'%';
GRANT ALL PRIVILEGES ON heri_tny_demo.* TO 'heri_tny_demo'@'%';

FLUSH PRIVILEGES;
