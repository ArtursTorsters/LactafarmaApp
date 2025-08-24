using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace LactafarmaAPI.Core
{
    public static class QueryHelper
    {
        private static readonly MethodInfo OrderByMethod =
            typeof(Queryable).GetRuntimeMethods().Single(method => method.Name == "OrderBy" && method.GetParameters().Length == 2);

        private static readonly MethodInfo OrderByDescendingMethod =
            typeof(Queryable).GetRuntimeMethods().Single(method => method.Name == "OrderByDescending" && method.GetParameters().Length == 2);

        public static bool PropertyExists<T>(string propertyName)
        {
            return typeof(T).GetRuntimeProperty(propertyName) != null;
        }

        public static IQueryable<T> OrderByProperty<T>(this IQueryable<T> source, string propertyName)
        {
            if (typeof(T).GetRuntimeProperty(propertyName) == null)
            {
                return null;
            }
            var paramterExpression = Expression.Parameter(typeof(T));
            Expression orderByProperty = Expression.Property(paramterExpression, propertyName);
            var lambda = Expression.Lambda(orderByProperty, paramterExpression);
            var genericMethod = OrderByMethod.MakeGenericMethod(typeof(T), orderByProperty.Type);
            var ret = genericMethod.Invoke(null, new object[] { source, lambda });
            return (IQueryable<T>)ret;
        }

        public static IQueryable<T> OrderByPropertyDescending<T>(this IQueryable<T> source, string propertyName)
        {
            if (typeof(T).GetRuntimeProperty(propertyName) == null)
            {
                return null;
            }
            var paramterExpression = Expression.Parameter(typeof(T));
            Expression orderByProperty = Expression.Property(paramterExpression, propertyName);
            var lambda = Expression.Lambda(orderByProperty, paramterExpression);
            var genericMethod = OrderByDescendingMethod.MakeGenericMethod(typeof(T), orderByProperty.Type);
            var ret = genericMethod.Invoke(null, new object[] { source, lambda });
            return (IQueryable<T>)ret;
        }
    }
}
