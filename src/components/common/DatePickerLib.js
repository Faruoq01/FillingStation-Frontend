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

const DateRangeLib = () => {
  let [range, setRange] = React.useState({
    start: parseDate("2020-07-03"),
    end: parseDate("2020-07-10"),
  });
  let formatter = useDateFormatter({ dateStyle: "long" });

  return (
    <DateRangePicker value={range} onChange={setRange}>
      <Group>
        {range
          ? formatter.formatRange(
              range.start.toDate(getLocalTimeZone()),
              range.end.toDate(getLocalTimeZone())
            )
          : "--"}
        <Button>▼</Button>
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

export default DateRangeLib;
