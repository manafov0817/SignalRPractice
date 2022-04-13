using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRTest.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRTest.Controllers
{
    public class AnnouncementController : Controller
    {
        private readonly IHubContext<MessageHub> _hubContext;
        public AnnouncementController(IHubContext<MessageHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpGet("/announcement")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("/announcement")]
        public async Task<IActionResult> Post([FromForm] string message)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message);
            return RedirectToAction("Index");
        }
    }
}
