import main from "./main.js";

const PORT = process.env.PORT || 3000;
main.listen(PORT, () => {
  console.log(
    `%cServer is running on port ${PORT}` + PORT,
    "color: blue; font-weight: bold;"
  );
});
