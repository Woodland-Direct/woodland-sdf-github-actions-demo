/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

/* global context, log, define */

define(['N/file', 'N/runtime'], function (file, runtime) {
  const getInputData = () => {
    var searchID = runtime.getCurrentScript().getParameter({ name: 'custscript_delete_files_files_search' })
    return {
      type: 'search',
      id: searchID
    }
  }

  const reduce = context => {
    const loggerTitle = 'reduce'
    try {
      const internalID = context.key

      log.debug(loggerTitle, `internalID: ${internalID}`)
        
      // delete file with internal id
      file.delete({
        id: internalID
      })

      log.audit(loggerTitle, `File Deleted: ${internalID}`)

    } catch (e) {
      log.error(loggerTitle, `Error: ${e}`)
    }
  }

  return {
    getInputData: getInputData,
    reduce: reduce
  }
})