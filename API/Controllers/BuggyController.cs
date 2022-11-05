using API.Errors;
using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        private readonly StoreContext context;

        public BuggyController(StoreContext context)
        {
            this.context = context;
        }

        [HttpGet("notfound")]
        public ActionResult GetNotFoundError()
        {
            return NotFound(new ApiResponse(404));
        }
        [HttpGet("servererror")]
        public ActionResult GetServerError()
        {
            var thing = context.Products.Find(600);
            var thing2 = thing?.ToString();

            return Ok(thing?.ToString());
        }
        [HttpGet("badrequest")]
        public ActionResult GetBadRequestError()
        {
            return BadRequest(new ApiResponse(400));
        }
        [HttpGet("validationerror/{id}")]
        public ActionResult GetValidationError(int id)
        {
            return Ok();
        }

        [Authorize]
        [HttpGet("testauth")]
        public string GetTestAuth() 
        {
            return "Got access";
        }
    }
}