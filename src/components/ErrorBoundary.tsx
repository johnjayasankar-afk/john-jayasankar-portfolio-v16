import { Component, createRef, type ErrorInfo, type ReactNode } from "react";
import { person } from "@/data/content";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  private alertRef = createRef<HTMLDivElement>();

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Route error:", error, info.componentStack);
  }

  componentDidUpdate(_: Props, prev: State) {
    if (this.state.error && !prev.error) {
      this.alertRef.current?.focus();
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="route-error" role="alert" tabIndex={-1} ref={this.alertRef}>
        <div className="route-error-inner">
          <p className="sys">Something went wrong</p>
          <h1 className="display">This page failed to load.</h1>
          <p className="lede">
 A chunk or render error stopped this view. Header and navigation above still work - use
            them, or recover from here.
          </p>
          <div className="hero-actions">
            <a className="btn btn-solid" href="/">
              Home
            </a>
            <a className="btn btn-line" href="/work">
              Work
            </a>
            <a className="btn btn-line" href="/simple">
              Simple page
            </a>
            <a className="btn btn-line" href={person.resume} target="_blank" rel="noopener noreferrer">
              Résumé
            </a>
            <a className="btn btn-line" href={`mailto:${person.email}`}>
              Email
            </a>
          </div>
          <p className="sys route-error-hint">⌘K / Ctrl K still opens jump if the chrome is up</p>
          <button
            type="button"
            className="text-link"
            onClick={() => {
              this.setState({ error: null });
              window.location.reload();
            }}
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
