// list of hardcode ids && pre-config data
// from list.page.ts file
const prefixUrl = 'https://api.practera.com/';
const appKey = '69ad1e66dc';
const milestones = {
  2391: [
   [349, 350, 347, 348], // creative thinker
   [345, 346, 343, 344], // confident communicator
   [361, 362, 359, 360], // ethical leader
   [341, 342, 339, 340], // career strategist
   [353, 354, 351, 352], // cross-cultural team player
   [357, 358, 355, 356], // digital citizen
   [326, 326, 326, 326], // newbie
  ],
  2535: [
    [628, 650, 626, 627], // creative thinker
    [625, 623, 652, 624], // confident communicator
    [637, 635, 655, 636], // ethical leader
    [622, 620, 651, 621], // career strategist
    [631, 629, 653, 630], // cross-cultural team player
    [634, 632, 654, 633], // digital citizen
    [619, 619, 619, 619], // newbie
  ],
};
const achievementListIDs = [ // for handling activities ticks data display order
  [355, 402, 353, 354], // creative thinker
  [351, 404, 349, 350], // confident communicator
  [370, 407, 368, 369], // ethical leader
  [344, 403, 342, 343], // career strategist
  [361, 405, 359, 360], // cross-cultural team player
  [365, 406, 363, 364], // digital citizen
  [341, 341, 341, 341], // newbie
];
const newbieOrderedIDs = [ // for handling initialized newbie assessment data display
  [341, 341, 341, 341],
  [355, 402, 353, 354],
  [351, 404, 349, 350],
  [370, 407, 368, 369],
  [344, 403, 342, 343],
  [361, 405, 359, 360],
  [365, 406, 363, 364]
];
const hardcode_assessment_id = 2134; // Reference Model - Assessment: Assessment ID:
const hardcode_context_id = 2532; // Reference Model - Assessment Context ID
// from activities-view.page.ts file
const hardcode_activity_id = 7850; // <Activity ID> is the activity id of career strategist, checking this id to see if all skills activities has been revealed.
const hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050]; // for handling submitted assessments title display
// const hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661]; // for handling submitted assessments title display
const portfolio_domain = 'assess/assessments/portfolio'; //for handling digital portfolio url
// function of hardcode list data
const HardcodeDataList = () => {
  const liveEndpoints = ['pe.practera.com', 'pe.rmit.edu.vn'];
  const devEndpoints = ['localhost', 'local.practera.com', '127.0.0.1'];
  this.appKey = appKey;

  if (devEndpoints.includes(window.location.hostname)) {
    // function for app to access hardcoded data
    // this is the URL prefix for all api requests
    this.prefixUrl = 'https://sandbox.practera.com/';

    // this is the AppKey from the experience admin screen
    this.appKey = appKey;

    // This is the base URL for the student to access their portfolio
    this.portfolio_domain = `https://sandbox.practera.com/portfolio`;

    // these are achievement IDs for the achievements earned when skills are submitted and pass review
    // they are used for determining the ordering/visibility of the ticks on the main page and skill detail page
    // experience (PE 2.0)
    this.achievementListIDs = [
      [628, 650, 626, 627], // creative thinker
      [625, 623, 652, 624], // confident communicator
      [637, 635, 655, 636], // ethical leader
      [622, 620, 651, 621], // career strategist
      [631, 629, 653, 630], // cross-cultural team player
      [634, 632, 654, 633], // digital citizen
      [619, 619, 619, 619], // newbie
    ];

    // deprecated due to changes in BE
    /*this.achievementListIDs = [
        [ 117, 139, 115, 116 ],
        [ 114, 141, 112, 113 ],
        [ 126, 144, 124, 125 ],
        [ 111, 140, 109, 110 ],
        [ 120, 142, 118, 119 ],
        [ 123, 143, 121, 122 ],
        [ 108, 108, 108, 108 ]
    ];*/

    // this version puts the newbie achievement first so that the "tutorial mode" can show the newbie first.
    this.newbieOrderedIDs = [
        [ 108, 108, 108, 108 ],
        [ 117, 139, 115, 116 ],
        [ 114, 141, 112, 113 ],
        [ 126, 144, 124, 125 ],
        [ 111, 140, 109, 110 ],
        [ 120, 142, 118, 119 ],
        [ 123, 143, 121, 122 ]
    ];

    // this is the AssessmentId and ContextId of the post-program survey, used as the "application" for a the final transcript
    // the transcript button will not link to the final transcript page until this is done
    // this.hardcode_assessment_id = 138;
    this.hardcode_assessment_id = 3683;
    this.hardcode_context_id = 109;

    // Activity ID is the activity id of Ethical Leader; if this is present on the screen then
    // we know that all of the skills activities has been revealed.
    this.hardcode_activity_id = 156;

    // These are the IDs of the skill submission assessments
    this.hardcodeAssessmentIds = [ 134, 135, 131, 132, 133, 136 ];

    // These are the QuestionIDs for the "title" question for each of the above assessment Ids, in the same order
    this.hardcodeQuestionIDs = [ 1813, 1823, 1783, 1793, 1803, 1833 ];

  } else if (!liveEndpoints.includes(window.location.hostname)) {
     // if not live server, then, go to sandbox hardcode list and pre-config data
    this.prefixUrl = 'https://sandbox.practera.com/';
    this.portfolio_domain = `https://sandbox.practera.com/${portfolio_domain}`;
    // this.prefixUrl = 'https://sandbox.practera.com/';
    // this.portfolio_domain = `https://sandbox.practera.com/${portfolio_domain}`;

    // hardcoded for Personal Edge Test Experience 1.0
    this.achievementListIDs = [
      [349, 350, 347, 348], // creative thinker
      [345, 346, 343, 344], // confident communicator
      [361, 362, 359, 360], // ethical leader
      [341, 342, 339, 340], // career strategist
      [353, 354, 351, 352], // cross-cultural team player
      [357, 358, 355, 356], // digital citizen
      [326, 326, 326, 326], // newbie
    ];

    // deprecated as in local environments
    /*this.achievementListIDs = [
      [349, 350, 347, 348],
      [345, 346, 343, 344],
      [361, 362, 359, 360],
      [341, 342, 339, 340],
      [353, 354, 351, 352],
      [357, 358, 355, 356],
      [326, 326, 326, 326]
    ];*/
    this.newbieOrderedIDs = [
      [326, 326, 326, 326],
      [349, 350, 347, 348],
      [345, 346, 343, 344],
      [361, 362, 359, 360],
      [341, 342, 339, 340],
      [353, 354, 351, 352],
      [357, 358, 355, 356]
    ];
    // this.hardcode_assessment_id = 2064;
    this.hardcode_assessment_id = 3683;
    this.hardcode_context_id = 2487;
    this.hardcode_activity_id = 7655;
    this.hardcodeAssessmentIds = [2066, 2067, 2068, 2069, 2070, 2071, 2050];
    this.hardcodeQuestionIDs = [20775, 20785, 20795, 20805, 20815, 20825, 20661];
  }  else { // use live endpoint
    this.prefixUrl = 'https://api.practera.com/';
    this.achievementListIDs = [
      [355, 402, 353, 354],
      [351, 404, 349, 350],
      [370, 407, 368, 369],
      [344, 403, 342, 343],
      [361, 405, 359, 360],
      [365, 406, 363, 364],
      [341, 341, 341, 341]
    ];
    this.newbieOrderedIDs = [
      [341, 341, 341, 341],
      [355, 402, 353, 354],
      [351, 404, 349, 350],
      [370, 407, 368, 369],
      [344, 403, 342, 343],
      [361, 405, 359, 360],
      [365, 406, 363, 364]
    ];
    this.hardcode_assessment_id = 2134;
    this.hardcode_context_id = 2532;
    this.hardcode_activity_id = 7850;
    this.hardcodeAssessmentIds = [2124, 2125, 2126, 2127, 2128, 2129, 2050];
    this.hardcodeQuestionIDs = [21316, 21327, 21338, 21349, 21360, 21371, 20661];
    this.portfolio_domain = `https://my.practera.com/${portfolio_domain}`;
  }
  return {
    filestack: {
      apiKey: 'AO6F4C72uTPGRywaEijdLz'
    },
    prefixUrl: this.prefixUrl,
    appKey: this.appKey,
    achievementListIDs: this.achievementListIDs,
    newbieOrderedIDs: this.newbieOrderedIDs,
    hardcode_assessment_id: this.hardcode_assessment_id,
    hardcode_context_id: this.hardcode_context_id,
    hardcode_activity_id: this.hardcode_activity_id,
    hardcodeAssessmentIds: this.hardcodeAssessmentIds,
    hardcodeQuestionIDs: this.hardcodeQuestionIDs,
    portfolio_domain: this.portfolio_domain,
    achievementsByMilestone: milestones,
  }
}
export default HardcodeDataList();
