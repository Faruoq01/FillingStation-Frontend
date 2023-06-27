import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function Dropdown() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div style={{}}>
      <FormControl style={{}} sx={{ m: 1, minWidth: 120 }}>
        <Select
          style={{
            maxHeight: 40,
            background: "#E6E6E6",
            color: "black",
            border: 0,
          }}
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="">
            <em>Fuel type</em>
          </MenuItem>
          <MenuItem value={10}>PMS</MenuItem>
          <MenuItem value={20}>DPK</MenuItem>
          <MenuItem value={30}>AGO</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
