/*
* this asyncHandler function accepts a function as a parameter
* pass it to async function with parameter like req, res, next
* parameter function awaits and executes the parameter function and 
*/

const asyncHandler = (fn) => 
/*return*/ async (req, res, next) =>{
    try {
      await fn(req, res, next)
    } catch (error) {
      res.status(error.code || 500).json({
        success: false,
        message: error.message
      })
    }
  }

export {asyncHandler}

// Option

// const asyncHandler = (fn)=>{
//   (req, res, next) => {
      // Promise.resolve(fn(req, res, next)).catch((err)=> next(err));
// }
// }