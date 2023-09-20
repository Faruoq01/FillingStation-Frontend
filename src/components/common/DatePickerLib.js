import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateRangePicker,
  Dialog,
  Group,
  Heading,
  Popover,
  RangeCalendar,
} from "react-aria-components";
import "../../styles/common/arialdate.scss";
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import React from "react";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";

const DateRangeLib = () => {
  let [range, setRange] = React.useState({
    start: parseDate("2020-07-03"),
    end: parseDate("2020-07-10"),
  });
  let formatter = useDateFormatter({ dateStyle: "long" });

  return (
    <DateRangePicker value={range} onChange={setRange}>
      <Group>
        <div className="date-format-text">
          {range
            ? formatter.formatRange(
                range.start.toDate(getLocalTimeZone()),
                range.end.toDate(getLocalTimeZone())
              )
            : "--"}
        </div>
        <Button>
          <InsertInvitationIcon sx={icon} />
        </Button>
      </Group>
      <Popover>
        <Dialog>
          <RangeCalendar>
            <header>
              <Button slot="previous">◀</Button>
              <Heading />
              <Button slot="next">▶</Button>
            </header>
            <CalendarGrid>
              {(date) => <CalendarCell date={date} />}
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
};

const icon = {
  width: "20px",
  height: "20px",
  color: "#fff",
  mr: 1,
};

export default DateRangeLib;
