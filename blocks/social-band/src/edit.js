import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { brushTop, spaceTop, spaceBottom, network, title, text, surface } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );
	const spaceOptions = [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ];

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Social Link Band" textDomain="lc-bot2026">
			<p>{ __( 'The address comes from Site-Wide Settings, under the Social tab. The band is hidden if it is empty.', 'lc-bot2026' ) }</p>
			<SelectControl label={ __( 'Network', 'lc-bot2026' ) } value={ network } options={ [ { value: 'instagram', label: 'Instagram' }, { value: 'facebook', label: 'Facebook' } ] } onChange={ ( v ) => setAttributes( { network: v } ) } />
			<TextControl label={ __( 'Heading (blank = default)', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<TextControl label={ __( 'Line under the heading (blank = the account name)', 'lc-bot2026' ) } value={ text } onChange={ ( v ) => setAttributes( { text: v } ) } />
			<SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [ { value: 'brand', label: 'Brand (dark)' }, { value: 'surface', label: 'Page (light)' }, { value: 'tint', label: 'Tint' }, { value: 'soft', label: 'Soft accent' } ] } onChange={ ( v ) => setAttributes( { surface: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ spaceOptions } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
