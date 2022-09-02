import deleteFilesDemo from 'SuiteScripts/map-reduce-scripts/mr-delete-files-demo'

describe('buildEmailMessage', () => {
  test('one file', () => {
    const fileNameArray = [
      'transaction_reports.csv'
    ]
    expect(deleteFilesDemo.buildEmailMessage(fileNameArray)).toEqual('<p>The following files have been removed:</p><table><tr><td>transaction_reports.csv</td></tr></table>')
  })

  test('multiple files', () => {
    const fileNameArray = [
      'transaction_reports.csv',
      'gas_fire_pit.png',
      'reply_email.pdf'
    ]

    expect(deleteFilesDemo.buildEmailMessage(fileNameArray)).toEqual('<p>The following files have been removed: </p><table><tr><td>transaction_reports.csv</td></tr><tr><td>gas_fire_pit.png</td></tr><tr><td>reply_email.pdf</td></tr></table>')
  })

  test('no files', () => {
    const fileNameArray = []

    expect(deleteFilesDemo.buildEmailMessage(fileNameArray)).toEqual('<p>No files have been removed</p>')
  })

})