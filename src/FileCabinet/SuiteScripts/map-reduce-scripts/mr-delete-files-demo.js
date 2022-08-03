/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

/* global context, log, define */

define(['N/file', 'N/runtime', 'N/cache', 'N/email'], function (file, runtime, cache, email) {
  const getInputData = () => {
    // start cache to store values of files that were deleted
    const fileCache = cache.getCache({
      name: 'FILES_DELETED',
      scope: cache.Scope.PRIVATE
    })

    // intiate an empty array in the cache for files deleted
    fileCache.put({
      key: 'filesDeleted',
      value: '[]'
    })

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

      const fileCache = cache.getCache({
        name: 'FILES_DELETED',
        scope: cache.Scope.PRIVATE
      })

      // get stored cache of files deleted
      let filesDeleted = JSON.parse(fileCache.get({
        key: 'filesDeleted'
      }))

      // get the name of the file that is to be deleted
      const fileObj = file.load({
        id: internalID
      })

      const fileName = fileObj.name
        
      // delete file with internal id
      file.delete({
        id: internalID
      })

      // push file name into array of deleted files
      filesDeleted.push(fileName)

      // store the updated array in the cache again
      fileCache.put({
        key: 'filesDeleted',
        value: JSON.stringify(filesDeleted)
      })

      log.audit(loggerTitle, 'File Deleted: ' + internalID)

    } catch (e) {
      log.error(loggerTitle, 'Error: ' + e)
      return false
    }
  }

  const summarize = context => {
    const fileCache = cache.getCache({
      name: 'FILES_DELETED',
      scope: cache.Scope.PRIVATE
    })

    const filesDeleted = JSON.parse(fileCache.get({
      key: 'filesDeleted'
    }))

    const mailMessage = buildEmailMessage(filesDeleted)

  }

  const buildEmailMessage = (filesDeleted) => {
    let deletedItemList = ''
    let emailMessage = ''

    if (filesDeleted.length > 0) {
      for (let fileID of filesDeleted) {
        deletedItemList += `<tr><td>${fileID}</td></tr>`
      }

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