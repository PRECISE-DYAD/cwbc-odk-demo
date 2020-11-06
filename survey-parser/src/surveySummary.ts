import {
  IFormDef,
  ISectionSummary,
  ISectionSummaryGroup,
  ISurveyWorksheetRow,
} from "../types";

/**
 * Create a queue of all rows from in a survey for processing
 * Recursively creates subsections to handle if/else statements
 * Process section to populate summary
 */
export class SurveySummary {
  // expose main summary object for access outside the class

  // fields for internal use
  private queue: ISurveyWorksheetRow[] = [];
  private sectionRows: ISurveyWorksheetRow[];
  private surveyValuesHash: { [key: string]: any };
  private sectionSummary: ISectionSummary;

  private childSections: SurveySummary[] = [];

  /**
   *
   * @param sectionName - this will be saved in overall section summary object
   * Subjections are denoted with sectionName:subSectionName and are merged into main summary
   * The combined name is used to see if the section has already been processed before
   * @param surveyValuesHash - {key:value} pairs of all user responses to the survey, for use in validation
   * @param subSectionRows - specific rows for processing within subsection
   */
  constructor(
    public formDef: IFormDef,
    public sectionName: string,
    surveyValuesHash?: { [key: string]: any },
    subSectionRows?: ISurveyWorksheetRow[]
  ) {
    this.sectionRows = subSectionRows || this.formDef.xlsx[sectionName as any];
    this.surveyValuesHash = surveyValuesHash || {};
    this.sectionSummary = { missing: {}, responses: {}, skipped: {} };
    // create a copy of original input for processing
    this.queue = Array.from(this.sectionRows);
    this.run();
  }

  /**
   * Iterate over any recursively nested sections, and extra their summaries
   * to combine with this and return
   */
  public get allSectionSummaries(): ISectionSummary[] {
    // console.log("get all section summaries", this.childSections);
    const summariesByName = {};
    summariesByName[this.sectionName] = this.sectionSummary;
    this.childSections.forEach(
      (s) => (summariesByName[s.sectionName] = s.sectionSummary)
    );
    // convert to an array
    const allSummaries: ISectionSummary[] = Object.keys(
      summariesByName
    ).map((sectionName) => ({ sectionName, ...summariesByName[sectionName] }));
    return allSummaries;
  }

  // quick method, when accessing the current row return the first item from the queue
  private get row() {
    return this.queue[0];
  }

  private run() {
    while (this.queue.length > 0) {
      this.processNextRow();
      this.queue.shift();
    }
  }

  private processNextRow() {
    const { type, clause, branch_label } = this.row;
    // these keys only affect question display so aren't important for evaluation

    // As rows contain a combination of keys that can point to different tasks iterate
    // through the keys to try and determine the intended operation and handle accordingly

    // question or prompt displayed
    if (type) {
      return this.handlePromptType();
    }
    if (clause) {
      return this.handleClause();
    }
    if (branch_label) {
      return;
    }
    // if not handled by any of the other methods then something is missing
    console.error("no handler for row");
    console.log(this.row);
    process.exit(1);
  }

  /**
   * When a prompt type is passed record whether the user answered the question
   * (if it was shown to them)
   */
  private handlePromptType() {
    const { name, required, type } = this.row;
    if (["assign", "note", "custom_warning"].includes(type)) {
      // ignore prompts not input by user
      return;
    }
    let summaryGroup: ISectionSummaryGroup;
    let summaryResponse: any;
    if (name) {
      const value = this.surveyValuesHash[name];
      if (value) {
        summaryGroup = "responses";
        summaryResponse = value;
      } else {
        if (required) {
          summaryGroup = "missing";
          summaryResponse = "";
        } else {
          summaryGroup = "skipped";
          summaryResponse = "";
        }
      }
    }
    if (summaryGroup) {
      this.sectionSummary[summaryGroup][name] = summaryResponse;
    } else {
      // display type only
    }
  }

  private handleClause() {
    const { clause } = this.row;
    const args = clause.split(" ");
    switch (args[0]) {
      case "if":
        this.handleIfClause();
        break;
      case "else":
        if (args[1] === undefined) break;
      case "end":
        // handled by if statement condition
        if (args[1] === "if") break;

      // if (condition) {
      //   this.handleConditionShouldProceed(condition);
      // }
      case "do":
        if (args[1] === "section") {
          // TODO - make sure to avoid any accidental infinite loops
          const sectionName = args[2];
          this.processSubsection(this.formDef.xlsx[sectionName], sectionName);
          break;
        }
      case "goto":
        const gotoLocation = args[1];
        console.info("skip goto", gotoLocation);
        // TODO either process or use xlsform converter section_reachable values to determine reachable sections
        break;
      case "exit":
        break;
      case "begin":
        if (args[1] === "screen") break;
      case "end":
        if (args[1] === "screen") break;

      default:
        console.error("arg not handled", args[0], clause);
        process.exit(1);
    }
  }
  /**
   * When an if block is discovered we need to check for corresponding end-if block
   * and also account for any else statements present, before evaluating the if
   * criteria and deciding what questions that are still valid for further evaluation
   */
  private handleIfClause() {
    const extractIfElseSections = (startIndex = 0): ISurveyWorksheetRow[][] => {
      let nestedIfCount = 0;
      const endIndex = this.queue.slice(startIndex).findIndex((el) => {
        if (el.clause === "if") nestedIfCount++;
        if (el.clause === "end if") nestedIfCount--;
        if (el.clause === "else") nestedIfCount--;
        return nestedIfCount === 0;
      });
      if (endIndex === -1) {
        console.log("could not find end index", startIndex);
        process.exit(1);
      }
      const queueEndIndex = startIndex + endIndex;
      const queueEndClause = this.queue[queueEndIndex].clause;

      // remove all rows from the queue excluding start and end clause statements (e.g. if/end-if)
      const ifSectionRows = this.queue.splice(1, queueEndIndex - 1);
      // generate additional else block if applicable
      if (queueEndClause === "else") {
        // as if block content has been removed (but start/else clause statements remain), continue search
        const elseSectionRows = extractIfElseSections(2)[0];
        return [ifSectionRows, elseSectionRows];
      } else {
        return [ifSectionRows];
      }
    };
    const [ifSection, elseSection] = extractIfElseSections();
    // Evaluate condition logic to determine if block would be shown to user, and process
    // Note, we don't want to process these sections as no useful data retrieved
    // (just because a question in a section wasn't shown, doesn't mean it isn't later repeated so no point tracking here)
    const shownToUser = this.evaluateCondition(this.row.condition);
    if (shownToUser) {
      this.processSubsection(ifSection);
    } else {
      // else section will be processed when exists an with opposite visibility of if block
      if (elseSection) {
        this.processSubsection(elseSection);
      }
    }
  }
  private processSubsection(rows: ISurveyWorksheetRow[], sectionName?: string) {
    const suffix = `${rows[0]._row_num}-${rows[rows.length - 1]._row_num}`;
    sectionName = sectionName || `${this.sectionName}:${suffix}`;
    const { childSections, sectionSummary } = new SurveySummary(
      this.formDef,
      sectionName,
      this.surveyValuesHash,
      rows
    );

    const parentSection = sectionName.split(":")[0];
    // merge summaries from if-else block sections
    if (parentSection === this.sectionName) {
      // merge child values into parent
      Object.keys(sectionSummary).forEach((k) => {
        this.sectionSummary[k] = {
          ...this.sectionSummary[k],
          ...sectionSummary[k],
        };
      });
    }
    // nest other major sections (not as full class, but just summary)
    else {
      this.childSections.push({
        childSections,
        sectionSummary,
        sectionName,
      } as any);
    }
  }

  private evaluateCondition(condition: string) {
    // data function called from eval
    const data = (field: string) => {
      return this.surveyValuesHash[field];
    };
    if (condition) {
      try {
        const res = eval(condition);
        // console.info("eval", condition, chalk.blue(res));
        return res;
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    }
    // if unspecified assume true
    else {
      return true;
    }
  }
}
