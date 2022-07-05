/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
/* File name: wa-get-result-date.js
 * NS Name: WA Get Result Date
 * NS_Rec URL:
 *
 * Authors: Stefan
 *
 * Requires: N/record
 *
 * Description: Returns the result date from a SQL query
 */

/* global context, log, define */

define(['N/runtime', 'N/query'], function (runtime, query) {
  const getResultDate = context => {
    const loggerTitle = 'getResultDate'
    log.debug(loggerTitle, 'entered getResultDate')
    log.debug(loggerTitle, `context: ${JSON.stringify(context)}`)
    try {
      const recordID = context.newRecord.id
      log.debug(loggerTitle, `recordID: ${recordID}`)
      // get the replacement tag parameters
      let replacementTags = []
      replacementTags[0] = runtime
        .getCurrentScript()
        .getParameter({ name: 'custscript_result_date_record_rep_tag_1' })
      replacementTags[1] = runtime
        .getCurrentScript()
        .getParameter({ name: 'custscript_result_date_record_rep_tag_2' })
      replacementTags[2] = runtime
        .getCurrentScript()
        .getParameter({ name: 'custscript_result_date_record_rep_tag_3' })

      log.debug(loggerTitle, `replacementTags: ${JSON.stringify(replacementTags)}`)

      // get the SQL string to execute
      let sqlString = runtime
        .getCurrentScript()
        .getParameter({ name: 'custscript_result_date_sql' })

      const resultProperty = runtime
      .getCurrentScript()
      .getParameter({ name: 'custscript_result_date_propert' })

      replacementTags = replacementTags.filter(replacementTagValue => {
        return replacementTagValue
      })

      log.debug(loggerTitle, `replacementTags: ${JSON.stringify(replacementTags)}`)

      // loop through the tag results and replace SQL string with tags
      for (var [idx, replacementTag] of replacementTags.entries()) {
        // create regular expression for tag ids
        let replaceRegEx = new RegExp(
          '\\$\\{custscript_result_date_record_rep_tag_' + (idx + 1) + '\\}'
        )
        
        log.debug(loggerTitle, `replaceRegEx: ${replaceRegEx}`)
        // replace replacement string with value
        sqlString = sqlString.replace(replaceRegEx, replacementTag)
      }

      let internalIDRegEx = new RegExp(
        '\\$\\{internalid\\}'
      )

      sqlString = sqlString.replace(internalIDRegEx, recordID)

      log.debug(loggerTitle, `sqlString: ${sqlString}`)

      // get query results
      const queryResults = query.runSuiteQL(sqlString).asMappedResults()

      log.debug(loggerTitle, `queryResults: ${JSON.stringify(queryResults)}`)
      
      return queryResults.length === 1 ? queryResults[0][resultProperty] : null

    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  return {
    onAction: getResultDate
  }
})
