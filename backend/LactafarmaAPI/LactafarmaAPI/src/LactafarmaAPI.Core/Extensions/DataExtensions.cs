using System.Collections.Generic;
using System.Linq;

namespace LactafarmaAPI.Core
{
    public static class DataExtensions
    {
        public static IEnumerable<T> ToFullyLoaded<T>(this IQueryable<T> query)
        {
            return query.ToArray().ToList();
        }

        public static IEnumerable<T> ToFullyLoaded<T>(this IEnumerable<T> enumerable)
        {
            return enumerable.ToList();
        }
    }
}
