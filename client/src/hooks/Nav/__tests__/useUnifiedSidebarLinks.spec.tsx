import React from 'react';
import { render, screen } from '@testing-library/react';
import type { NavLink } from '~/common';

const mockUseGetStartupConfig = jest.fn();
const mockUseGetEndpointsQuery = jest.fn();
const mockUseSideNavLinks = jest.fn();
const mockUseUserKeyQuery = jest.fn();
const mockUseRecoilValue = jest.fn();

jest.mock('recoil', () => ({
  useRecoilValue: (...args: unknown[]) => mockUseRecoilValue(...args),
}));

jest.mock('librechat-data-provider/react-query', () => ({
  useUserKeyQuery: (...args: unknown[]) => mockUseUserKeyQuery(...args),
}));

jest.mock('librechat-data-provider', () => ({
  getConfigDefaults: () => ({ interface: {} }),
  getEndpointField: () => undefined,
}), { virtual: true });

jest.mock('~/data-provider', () => ({
  useGetStartupConfig: (...args: unknown[]) => mockUseGetStartupConfig(...args),
  useGetEndpointsQuery: (...args: unknown[]) => mockUseGetEndpointsQuery(...args),
}));

jest.mock('~/hooks/Nav/useSideNavLinks', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseSideNavLinks(...args),
}));

jest.mock('~/components/UnifiedSidebar/ConversationsSection', () => ({
  __esModule: true,
  default: () => <div data-testid="conversations-section" />,
}));

jest.mock('~/components/SidePanel/KnowledgeOS/KnowledgeOSPanel', () => ({
  __esModule: true,
  default: () => <div data-testid="knowledge-os-panel" />,
}));

jest.mock('~/store', () => ({
  __esModule: true,
  default: {
    conversationByIndex: () => 'conversation-atom',
  },
}));

import useUnifiedSidebarLinks from '../useUnifiedSidebarLinks';

function RenderLinks() {
  const links = useUnifiedSidebarLinks();
  return (
    <ul>
      {links.map((link: NavLink) => (
        <li key={link.id}>{link.id}</li>
      ))}
    </ul>
  );
}

describe('useUnifiedSidebarLinks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRecoilValue.mockReturnValue({ endpoint: 'custom' });
    mockUseGetEndpointsQuery.mockReturnValue({ data: {} });
    mockUseUserKeyQuery.mockReturnValue({ data: { expiresAt: undefined } });
    mockUseSideNavLinks.mockReturnValue([]);
  });

  it('does not add Knowledge OS when startup config disables it', () => {
    mockUseGetStartupConfig.mockReturnValue({ data: { knowledgeOS: { enabled: false } } });

    render(<RenderLinks />);

    expect(screen.queryByText('knowledge-os')).not.toBeInTheDocument();
  });

  it('adds Knowledge OS when startup config enables it', () => {
    mockUseGetStartupConfig.mockReturnValue({ data: { knowledgeOS: { enabled: true } } });

    render(<RenderLinks />);

    expect(screen.getByText('conversations')).toBeInTheDocument();
    expect(screen.getByText('knowledge-os')).toBeInTheDocument();
  });
});
