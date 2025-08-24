using System;
using System.Collections.Generic;
using System.Text;

namespace LactafarmaAPI.Core
{
    public class PagedDataRequest
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }

        public PagedDataRequest()
        {
            PageIndex = 0;
            PageSize = 2147483647;
        }
    }
}
