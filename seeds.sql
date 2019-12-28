USE sqwash;

INSERT INTO 
    startups (name)
VALUES 
    ("startUpOne"),
    ("startUpTwo"),
    ("startUpThree");

INSERT INTO 
    developers (name, info)
VALUES 
    ("devOne", "Info goes here"),
    ("devTwo", "Info goes here"),
    ("devThree", "Info goes here");

INSERT INTO 
    projects (title, description, startup_id)
VALUES 
    ("projOne", "testerOne", 1),
    ("projTwo", "testerTwo", 2),
    ("projThree", "testerThree", 3);

INSERT INTO
    applicants (dev_id, proj_id)
VALUES
    (2, 1),
    (3, 2),
    (1, 3);