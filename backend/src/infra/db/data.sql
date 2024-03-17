-- Chamber data
INSERT INTO chambers (id, latitude, longitude, total_capacity, used_capacity, geom)
VALUES
(
    'VORB-X8734',
    51.52466903333144,
    -0.08320212364196779,
    100,
    70,
    ST_SetSRID(ST_MakePoint(-0.08320212364196779, 51.52466903333144), 4326)
),
(
    'VORB-Z4784',
    51.523641015718525,
    -0.08601307868957521,
    100,
    10,
    ST_SetSRID(ST_MakePoint(-0.08601307868957521, 51.523641015718525), 4326)
),
(
    'VORB-N2837',
    51.523434943212514,
    -0.08114755153656007,
    100,
    40,
    ST_SetSRID(ST_MakePoint(-0.08114755153656007, 51.523434943212514), 4326)
),
(
    'VORB-V9345',
    51.52211691871454,
    -0.0851869583129883,
    100,
    30,
    ST_SetSRID(ST_MakePoint(-0.0851869583129883, 51.52211691871454), 4326)
),
(
    'VORB-Q9547',
    51.523304662537235,
    -0.08331477642059326,
    100,
    70,
    ST_SetSRID(ST_MakePoint(-0.08331477642059326, 51.523304662537235), 4326)
);
