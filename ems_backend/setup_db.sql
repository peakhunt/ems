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
