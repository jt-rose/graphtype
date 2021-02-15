COPY games (
    "name",
    console,
    Year_of_Release,
    Genre,
    Publisher,
    NA_players,
    EU_players,
    JP_players,
    Other_players,
    Global_players,
    Critic_Score,
    Critic_Count,
    User_Score,
    User_Count,
    Developer,
    Rating
)
FROM 'C:\Users\jtr21\Desktop\WebDev\graphtype\imports\vg_data_clean.csv' WITH (FORMAT CSV, HEADER);