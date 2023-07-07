import React, { Fragment } from "react";

export default function SegmentedCircle() {
  return (
    <Fragment>
      <div class="segmented-progresscircle">
        <div class="segmented-progresscircle__text">
          <div class="segmented-progresscircle__text__primary">0/10</div>
          <div class="segmented-progresscircle__text__secondary">You suck</div>
        </div>
        <div class="segmented-progresscircle__circles">
          <svg>
            <circle
              r="59"
              cy="80"
              cx="80"
              stroke-width="5"
              class="segmented-progresscircle__circles__background-dashes"
            ></circle>
            <circle
              r="59"
              cy="80"
              cx="80"
              stroke-width="6"
              class="segmented-progresscircle__circles__progress-dashes segmented-progresscircle__circles__progress-dashes--0"
            ></circle>
          </svg>
        </div>
      </div>

      <div class="segmented-progresscircle">
        <div class="segmented-progresscircle__text">
          <div class="segmented-progresscircle__text__primary">10/10</div>
          <div class="segmented-progresscircle__text__secondary">Amazing</div>
        </div>
        <div class="segmented-progresscircle__circles">
          <svg>
            <circle
              r="59"
              cy="80"
              cx="80"
              stroke-width="5"
              class="segmented-progresscircle__circles__background-dashes"
            ></circle>
            <circle
              r="59"
              cy="80"
              cx="80"
              stroke-width="6"
              class="segmented-progresscircle__circles__progress-dashes segmented-progresscircle__circles__progress-dashes--10"
            ></circle>
          </svg>
        </div>
      </div>

      <div class="segmented-progresscircle">
        <div class="segmented-progresscircle__text">
          <div class="segmented-progresscircle__text__primary">2/10</div>
          <div class="segmented-progresscircle__text__secondary">helt ok</div>
        </div>
        <div class="segmented-progresscircle__circles">
          <svg>
            <circle
              r="59"
              cy="80"
              cx="80"
              stroke-width="5"
              class="segmented-progresscircle__circles__background-dashes"
            ></circle>
            <circle
              r="59"
              cy="80"
              cx="80"
              stroke-width="6"
              class="segmented-progresscircle__circles__progress-dashes segmented-progresscircle__circles__progress-dashes--2"
            ></circle>
          </svg>
        </div>
      </div>
    </Fragment>
  );
}
