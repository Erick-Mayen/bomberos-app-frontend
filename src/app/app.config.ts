import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { routes } from './app.routes';
import { InMemoryCache, createHttpLink, from, ApolloClientOptions } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

export function createApolloOptions(): ApolloClientOptions<any> {
  const httpLink = createHttpLink({
    uri: 'http://192.168.1.7:3000/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }
    };
  });

  return {
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
      mutate: { errorPolicy: 'all' },
    },
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideApollo(() => createApolloOptions()),
  ],
};
