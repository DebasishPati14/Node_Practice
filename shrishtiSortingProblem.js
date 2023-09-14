const arrObj = [
  {
    name: 'Ckash',
    title: 'Sood Boy',
    price: 723
  },
  {
    name: 'Badal',
    title: 'Tood Boy No 2',
    price: 130
  },
  {
    name: 'Barsha',
    title: 'Hood Girl No 3',
    price: 523
  }
]

function sortingArr () {
  const sortedObj = arrObj.sort((a, b) => {
    // console.log(a.title.split(''))
    if (a.name > b.name) {
      return 1
    } else if (a.name < b.name) {
      return -1
    } else {
      return 0
    }
  })
  console.log(arrObj)
  console.log(sortedObj)
}

sortingArr()

// [12, 4, 56, 87, 90, 3]
