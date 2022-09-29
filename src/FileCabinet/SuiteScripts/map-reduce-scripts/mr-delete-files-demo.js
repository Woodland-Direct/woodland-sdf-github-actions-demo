/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

/* global context, log, define */

define(['N/file', 'N/runtime', 'N/email'], function (file, runtime, cache, email) {
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

      log.debug(loggerTitle, 'internalID: ' + internalID)


      // get the name of the file that is to be deleted
      const fileObj = file.load({
        id: internalID
      })

      const fileName = fileObj.name
        
      // delete file with internal id
      file.delete({
        id: internalID
      })

      context.write(contextValues.key, fileName)

      log.audit(loggerTitle, 'File Deleted: ' + internalID)

    } catch (e) {
      log.error(loggerTitle, 'Error: ' + e)
      return false
    }
  }

  const summarize = context => {
    const mailMessage = buildEmailMessage(context)
  }

  const buildEmailMessage = (context) => {
    let deletedItemList = ''
    let emailMessage = ''

    if (filesDeleted.length > 0) {
      context.output.iterator().each((key, value) => {
        deletedItemList += `<tr><td>${value}</td></tr>`
      })

      const fullDeletedItemList = `<table>${deletedItemList}</table>`
      emailMessage = `<p>The following files have been removed: </p>${fullDeletedItemList}`
    } else {
      emailMessage = '<p>No files have been removed</p>'
    }

    return emailMessage
  }

  return {
    getInputData: getInputData,
    reduce: reduce,
    summarize: summarize,
    buildEmailMessage: buildEmailMessage
  }
})
