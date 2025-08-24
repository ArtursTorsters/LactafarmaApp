using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using LactafarmaAPI.Domain.Models;

namespace LactafarmaAPI.Controllers.Api.Interfaces
{
    interface IAlertsController
    {
        IEnumerable<Alert> GetAlertsByProduct(int productId);
        IEnumerable<Domain.Models.Alert> GetLastAlerts();
        Domain.Models.Alert GetAlert(int alertId);
    }
}
