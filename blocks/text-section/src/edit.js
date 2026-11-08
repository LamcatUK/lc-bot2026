import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TextControl, SelectControl, ToggleControl } from '@wordpress/components';
import EditorBlockShell from '../../_shared/EditorBlockShell';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, content, surface, align, brushEdge } = attributes;
	const { brushTop, spaceTop, spaceBottom } = attributes;
	const blockProps = useBlockProps( { className: 'container lc-bot2026-editor-block' } );

	return (
		<EditorBlockShell blockProps={ blockProps } clientId={ clientId } title="Text Section" textDomain="lc-bot2026">
			<TextControl label={ __( 'Title', 'lc-bot2026' ) } value={ title } onChange={ ( v ) => setAttributes( { title: v } ) } />
			<div className="lc-bot2026-editor-field">
				<label className="lc-bot2026-editor-field__label">{ __( 'Content', 'lc-bot2026' ) }</label>
				<RichText tagName="div" preserveWhiteSpace className="lc-bot2026-editor-field__control" placeholder={ __( 'Content', 'lc-bot2026' ) } value={ content } onChange={ ( v ) => setAttributes( { content: v } ) } />
			</div>
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Surface', 'lc-bot2026' ) } value={ surface } options={ [{"value":"surface","label":"Page (light)"},{"value":"tint","label":"Tint"},{"value":"soft","label":"Soft accent"},{"value":"brand","label":"Brand (dark)"}] } onChange={ ( v ) => setAttributes( { surface: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Alignment', 'lc-bot2026' ) } value={ align } options={ [ { value: 'left', label: 'Left' }, { value: 'center', label: 'Centre' } ] } onChange={ ( v ) => setAttributes( { align: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the bottom', 'lc-bot2026' ) } checked={ !! brushEdge } onChange={ ( v ) => setAttributes( { brushEdge: v } ) } />
			<div style={ { display: 'flex', gap: '12px' } }>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space above', 'lc-bot2026' ) } value={ spaceTop || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } onChange={ ( v ) => setAttributes( { spaceTop: v } ) } /></div>
				<div style={ { flex: '1 1 0' } }><SelectControl label={ __( 'Space below', 'lc-bot2026' ) } value={ spaceBottom || 'normal' } options={ [ { value: 'normal', label: __( 'Normal', 'lc-bot2026' ) }, { value: 'small', label: __( 'Small', 'lc-bot2026' ) }, { value: 'none', label: __( 'None', 'lc-bot2026' ) } ] } help={ __( 'Trim the gap between neighbouring blocks that share a colour.', 'lc-bot2026' ) } onChange={ ( v ) => setAttributes( { spaceBottom: v } ) } /></div>
			</div>
			<ToggleControl label={ __( 'Brush edge at the top', 'lc-bot2026' ) } help={ __( 'Paints this block over the bottom of the one above.', 'lc-bot2026' ) } checked={ !! brushTop } onChange={ ( v ) => setAttributes( { brushTop: v } ) } />
		</EditorBlockShell>
	);
}
