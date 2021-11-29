use ems;

-- test table
drop table if exists test_table;
create table test_table
(
  num_id int not null
);

insert into test_table values (0);
insert into test_table values (1);
insert into test_table values (2);
insert into test_table values (3);
insert into test_table values (4);
insert into test_table values (5);

-- schema version
drop table if exists ems_schema;
create table ems_schema
(
  version int not null
);
insert into ems_schema values (1);    -- schema version 1

-- users table
drop table if exists ems_users;
create table ems_users
(
  username varchar(40) not null,
  password varchar(40) not null,
  admin boolean not null,
  capabilities int unsigned not null,
  primary key (username)
);

insert into ems_users values ('admin', 'admin', true, 0xffffffff);
insert into ems_users values ('scanjetems', 'scanjetems', false, 0xfffffffe);

-- event log
drop table if exists ems_event_logs;
create table ems_event_logs
(
 id int not null auto_increment,
 category char(16) not null,
 description char(120) not null,
 time datetime,
 primary key (id)
);
